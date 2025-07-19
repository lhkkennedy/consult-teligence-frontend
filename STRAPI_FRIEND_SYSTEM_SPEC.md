# Strapi v5 Friend System Implementation Specification

## Overview

This specification outlines the implementation of a professional networking friend system for Strapi v5 CMS. The system allows users to send friend requests, accept/reject requests, manage their professional network, and view their connections.

## Database Schema

### 1. Friend Request Collection Type

**Name:** `friend-request`

**Fields:**

- `from` (Relation - Many to One with User)

  - Type: Relation
  - Target: User
  - Required: true
  - Description: The user sending the friend request

- `to` (Relation - Many to One with User)

  - Type: Relation
  - Target: User
  - Required: true
  - Description: The user receiving the friend request

- `status` (Enumeration)

  - Type: Enumeration
  - Values: `pending`, `accepted`, `rejected`
  - Default: `pending`
  - Required: true
  - Description: Current status of the friend request

- `createdAt` (DateTime)

  - Type: DateTime
  - Auto-generated
  - Description: When the request was created

- `updatedAt` (DateTime)
  - Type: DateTime
  - Auto-generated
  - Description: When the request was last updated

### 2. Friends Collection Type

**Name:** `friends`

**Fields:**

- `user1` (Relation - Many to One with User)

  - Type: Relation
  - Target: User
  - Required: true
  - Description: First user in the friendship

- `user2` (Relation - Many to One with User)

  - Type: Relation
  - Target: User
  - Required: true
  - Description: Second user in the friendship

- `createdAt` (DateTime)
  - Type: DateTime
  - Auto-generated
  - Description: When the friendship was established

## API Endpoints

### Friend Requests

#### 1. Create Friend Request

```
POST /api/friend-requests
```

**Request Body:**

```json
{
	"data": {
		"to": 123,
		"status": "pending"
	}
}
```

**Response:**

```json
{
	"data": {
		"id": 1,
		"attributes": {
			"status": "pending",
			"createdAt": "2024-01-01T00:00:00.000Z",
			"updatedAt": "2024-01-01T00:00:00.000Z"
		},
		"relationships": {
			"from": {
				"data": {
					"id": 1,
					"type": "user"
				}
			},
			"to": {
				"data": {
					"id": 123,
					"type": "user"
				}
			}
		}
	}
}
```

#### 2. Update Friend Request Status

```
PUT /api/friend-requests/:id
```

**Request Body:**

```json
{
	"data": {
		"status": "accepted"
	}
}
```

#### 3. Get Pending Friend Requests (Received)

```
GET /api/friend-requests?populate[from][populate][0]=profileImage&populate[to][populate][0]=profileImage&filters[to][id][$eq]=current&filters[status][$eq]=pending
```

#### 4. Get Sent Friend Requests

```
GET /api/friend-requests?populate[from][populate][0]=profileImage&populate[to][populate][0]=profileImage&filters[from][id][$eq]=current&filters[status][$eq]=pending
```

### Friends

#### 1. Get Friends List

```
GET /api/friends?populate[profileImage]=*
```

#### 2. Remove Friend

```
DELETE /api/friends/:id
```

#### 3. Check Friendship Status

```
GET /api/friends?filters[user][id][$eq]=:userId
```

## Custom Controllers and Services

### 1. Friend Request Controller

Create custom controller to handle friend request logic:

```javascript
// src/api/friend-request/controllers/friend-request.js
'use strict';

module.exports = createCoreController('api::friend-request.friend-request', ({ strapi }) => ({
	async create(ctx) {
		const { data } = ctx.request.body;
		const userId = ctx.state.user.id;

		// Check if request already exists
		const existingRequest = await strapi.entityService.findMany(
			'api::friend-request.friend-request',
			{
				filters: {
					$or: [
						{ from: userId, to: data.to },
						{ from: data.to, to: userId }
					]
				}
			}
		);

		if (existingRequest.length > 0) {
			return ctx.badRequest('Friend request already exists');
		}

		// Check if users are already friends
		const existingFriendship = await strapi.entityService.findMany('api::friends.friends', {
			filters: {
				$or: [
					{ user1: userId, user2: data.to },
					{ user1: data.to, user2: userId }
				]
			}
		});

		if (existingFriendship.length > 0) {
			return ctx.badRequest('Users are already friends');
		}

		// Create friend request
		const result = await strapi.entityService.create('api::friend-request.friend-request', {
			data: {
				...data,
				from: userId
			}
		});

		return result;
	},

	async update(ctx) {
		const { id } = ctx.params;
		const { data } = ctx.request.body;
		const userId = ctx.state.user.id;

		// Get the friend request
		const friendRequest = await strapi.entityService.findOne(
			'api::friend-request.friend-request',
			id,
			{
				populate: ['from', 'to']
			}
		);

		if (!friendRequest) {
			return ctx.notFound('Friend request not found');
		}

		// Only the recipient can accept/reject
		if (friendRequest.to.id !== userId) {
			return ctx.forbidden('Not authorized to update this request');
		}

		// Update the request
		const result = await strapi.entityService.update('api::friend-request.friend-request', id, {
			data
		});

		// If accepted, create friendship
		if (data.status === 'accepted') {
			await strapi.entityService.create('api::friends.friends', {
				data: {
					user1: friendRequest.from.id,
					user2: friendRequest.to.id
				}
			});
		}

		return result;
	}
}));
```

### 2. Friends Controller

Create custom controller for friends management:

```javascript
// src/api/friends/controllers/friends.js
'use strict';

module.exports = createCoreController('api::friends.friends', ({ strapi }) => ({
	async find(ctx) {
		const userId = ctx.state.user.id;

		// Get user's friends
		const friends = await strapi.entityService.findMany('api::friends.friends', {
			filters: {
				$or: [{ user1: userId }, { user2: userId }]
			},
			populate: {
				user1: {
					populate: ['profileImage']
				},
				user2: {
					populate: ['profileImage']
				}
			}
		});

		// Transform to return only friend data (not the current user)
		const friendUsers = friends.map((friendship) => {
			return friendship.user1.id === userId ? friendship.user2 : friendship.user1;
		});

		return {
			data: friendUsers,
			meta: {
				pagination: {
					page: 1,
					pageSize: friendUsers.length,
					pageCount: 1,
					total: friendUsers.length
				}
			}
		};
	},

	async delete(ctx) {
		const { id } = ctx.params;
		const userId = ctx.state.user.id;

		// Find the friendship
		const friendship = await strapi.entityService.findMany('api::friends.friends', {
			filters: {
				$or: [
					{ user1: userId, user2: id },
					{ user1: id, user2: userId }
				]
			}
		});

		if (friendship.length === 0) {
			return ctx.notFound('Friendship not found');
		}

		// Delete the friendship
		await strapi.entityService.delete('api::friends.friends', friendship[0].id);

		return { success: true };
	}
}));
```

## Custom Routes

### 1. Friend Request Routes

```javascript
// src/api/friend-request/routes/friend-request.js
module.exports = {
	routes: [
		{
			method: 'GET',
			path: '/friend-requests/pending',
			handler: 'friend-request.getPending',
			config: {
				policies: ['global::isAuthenticated']
			}
		},
		{
			method: 'GET',
			path: '/friend-requests/sent',
			handler: 'friend-request.getSent',
			config: {
				policies: ['global::isAuthenticated']
			}
		}
	]
};
```

### 2. Friends Routes

```javascript
// src/api/friends/routes/friends.js
module.exports = {
	routes: [
		{
			method: 'GET',
			path: '/friends/status/:userId',
			handler: 'friends.checkStatus',
			config: {
				policies: ['global::isAuthenticated']
			}
		}
	]
};
```

## Permissions Configuration

### 1. Friend Request Permissions

- **Public:** None
- **Authenticated:** Create, Read own requests, Update own received requests
- **Admin:** Full CRUD

### 2. Friends Permissions

- **Public:** None
- **Authenticated:** Read own friends, Delete own friendships
- **Admin:** Full CRUD

## Validation Rules

### 1. Friend Request Validation

```javascript
// src/api/friend-request/content-types/friend-request/schema.json
{
  "kind": "collectionType",
  "collectionName": "friend_requests",
  "info": {
    "singularName": "friend-request",
    "pluralName": "friend-requests",
    "displayName": "Friend Request"
  },
  "options": {
    "draftAndPublish": false
  },
  "attributes": {
    "from": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "plugin::users-permissions.user",
      "inversedBy": "sentFriendRequests"
    },
    "to": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "plugin::users-permissions.user",
      "inversedBy": "receivedFriendRequests"
    },
    "status": {
      "type": "enumeration",
      "enum": ["pending", "accepted", "rejected"],
      "default": "pending"
    }
  }
}
```

### 2. Friends Validation

```javascript
// src/api/friends/content-types/friends/schema.json
{
  "kind": "collectionType",
  "collectionName": "friends",
  "info": {
    "singularName": "friends",
    "pluralName": "friends",
    "displayName": "Friends"
  },
  "options": {
    "draftAndPublish": false
  },
  "attributes": {
    "user1": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "plugin::users-permissions.user"
    },
    "user2": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "plugin::users-permissions.user"
    }
  }
}
```

## User Model Extensions

### 1. Extend User Model

Add relations to the User model:

```javascript
// src/extensions/users-permissions/content-types/user/schema.json
{
  "kind": "collectionType",
  "collectionName": "up_users",
  "info": {
    "name": "user",
    "description": "",
    "singularName": "user",
    "pluralName": "users",
    "displayName": "User"
  },
  "options": {
    "draftAndPublish": false
  },
  "attributes": {
    // ... existing fields ...
    "sentFriendRequests": {
      "type": "relation",
      "relation": "oneToMany",
      "target": "api::friend-request.friend-request",
      "mappedBy": "from"
    },
    "receivedFriendRequests": {
      "type": "relation",
      "relation": "oneToMany",
      "target": "api::friend-request.friend-request",
      "mappedBy": "to"
    }
  }
}
```

## Implementation Steps

1. **Create Collection Types**

   - Generate `friend-request` collection type
   - Generate `friends` collection type
   - Configure fields and relations

2. **Extend User Model**

   - Add friend request relations to User model
   - Update permissions

3. **Create Custom Controllers**

   - Implement friend request logic
   - Implement friends management logic
   - Add validation and business rules

4. **Configure Permissions**

   - Set up role-based permissions
   - Configure API access rules

5. **Test API Endpoints**

   - Test friend request creation
   - Test request acceptance/rejection
   - Test friends list retrieval
   - Test friendship removal

6. **Add Business Logic**
   - Prevent duplicate requests
   - Handle friendship creation on acceptance
   - Add notification system (optional)

## Frontend Integration Notes

The frontend expects these API endpoints:

- `POST /api/friend-requests` - Send friend request
- `PUT /api/friend-requests/:id` - Accept/reject request
- `GET /api/friend-requests` - Get requests with filters
- `GET /api/friends` - Get friends list
- `DELETE /api/friends/:id` - Remove friend

The frontend uses authentication tokens and expects user data to include:

- `id`, `username`, `email`
- Optional: `firstName`, `lastName`, `profileImage`, `company`, `currentRole`, `location`

## Security Considerations

1. **Authentication Required**

   - All friend system endpoints require authentication
   - Users can only manage their own requests and friendships

2. **Validation**

   - Prevent self-friend requests
   - Prevent duplicate requests
   - Validate request ownership before updates

3. **Rate Limiting**

   - Implement rate limiting on friend request creation
   - Prevent spam requests

4. **Data Privacy**
   - Users can only see their own friends and requests
   - Profile data visibility controlled by existing permissions
