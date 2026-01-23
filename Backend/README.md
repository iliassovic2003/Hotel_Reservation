## 📁 Backend Structure

```
hotel-booking-backend/
├── src/
│   └── java/
│       └── hotelbooking/
│           │
│           ├── HotelBookingApplication.java
│           │
│           ├── config/
│           │   ├── SecurityConfig.java
│           │   ├── JwtConfig.java
│           │   ├── CorsConfig.java
│           │   ├── WebConfig.java
│           │   └── OpenApiConfig.java
│           │
│           ├── controller/
│           │   ├── AuthController.java
│           │   ├── UserController.java
│           │   ├── HotelController.java
│           │   ├── RoomController.java
│           │   └── BookingController.java
│           │
│           ├── service/
│           │   ├── AuthService.java
│           │   ├── UserService.java
│           │   ├── HotelService.java
│           │   ├── RoomService.java
│           │   ├── BookingService.java
│           │   └── EmailService.java
│           │
│           ├── repository/
│           │   ├── UserRepository.java
│           │   ├── HotelRepository.java
│           │   ├── RoomRepository.java
│           │   └── BookingRepository.java
│           │
│           ├── entity/
│           │   ├── User.java
│           │   ├── Hotel.java
│           │   ├── Room.java
│           │   ├── Booking.java
│           │   ├── Review.java
│           │   └── enums/
│           │       ├── Role.java
│           │       ├── BookingStatus.java
│           │       └── RoomType.java
│           │
│           ├── dto/
│           │   ├── request/
│           │   │   ├── LoginRequest.java
│           │   │   ├── RegisterRequest.java
│           │   │   ├── CreateHotelRequest.java
│           │   │   ├── UpdateHotelRequest.java
│           │   │   ├── CreateRoomRequest.java
│           │   │   ├── CreateBookingRequest.java
│           │   │   └── SearchRequest.java
│           │   │
│           │   └── response/
│           │       ├── AuthResponse.java
│           │       ├── UserResponse.java
│           │       ├── HotelResponse.java
│           │       ├── RoomResponse.java
│           │       ├── BookingResponse.java
│           │       ├── ApiResponse.java
│           │       └── PageResponse.java
│           │
│           ├── mapper/
│           │   ├── UserMapper.java
│           │   ├── HotelMapper.java
│           │   ├── RoomMapper.java
│           │   └── BookingMapper.java
│           │
│           ├── security/
│           │   ├── JwtAuthenticationFilter.java
│           │   ├── JwtTokenProvider.java
│           │   ├── CustomUserDetailsService.java
│           │   └── SecurityUtils.java
│           │
│           ├── exception/
│           │   ├── GlobalExceptionHandler.java
│           │   ├── ResourceNotFoundException.java
│           │   ├── BadRequestException.java
│           │   ├── UnauthorizedException.java
│           │   ├── BookingConflictException.java
│           │   └── ErrorResponse.java
│           │
│           ├── validation/
│           │   ├── validator/
│           │   │   ├── DateRangeValidator.java
│           │   │   └── PhoneNumberValidator.java
│           │   └── annotation/
│           │       ├── ValidDateRange.java
│           │       └── ValidPhoneNumber.java
│           │
│           └── util/
│               ├── DateUtils.java
│               └── Constants.java
│
├── resources/
│   ├── application.yml
│   ├── application-dev.yml
│   ├── application-prod.yml
│   ├── db/
│   │   └── migration/
│   │       ├── V1__create_users_table.sql
│   │       ├── V2__create_hotels_table.sql
│   │       ├── V3__create_rooms_table.sql
│   │       └── V4__create_bookings_table.sql
│   └── static/
│       └── images/
│
├── .gitignore
├── README.md
├── pom.xml
└── docker-compose.yml
```

### 🏗️ Main Application Structure
### ⚙️ config/ - Configuration Classes

| File | Purpose |
|------|---------|
| **SecurityConfig.java** | Configures Spring Security, CORS, authentication filters |
| **JwtConfig.java** | JWT token configuration (secret key, expiration) |
| **CorsConfig.java** | Cross-Origin Resource Sharing settings for frontend |
| **WebConfig.java** | General web configurations (interceptors, formatters) |
| **OpenApiConfig.java** | Swagger/OpenAPI documentation configuration |

---

### 🎮 controller/ - REST API Endpoints

| Controller | Endpoints | Responsibility |
|------------|-----------|----------------|
| **AuthController.java** | `/api/auth/*` | Login, Register, Refresh Token |
| **UserController.java** | `/api/users/*` | Get user profile, Update profile |
| **HotelController.java** | `/api/hotels/*` | CRUD operations for hotels |
| **RoomController.java** | `/api/rooms/*` | CRUD operations for rooms |
| **BookingController.java** | `/api/bookings/*` | Create, view, cancel bookings |

---

### 💼 service/ - Business Logic Layer

| Service | Responsibility |
|---------|----------------|
| **AuthService.java** | User registration, login, JWT token generation |
| **UserService.java** | User profile management |
| **HotelService.java** | Hotel business logic, validation |
| **RoomService.java** | Room availability, pricing logic |
| **BookingService.java** | Booking creation, validation, conflict checking |
| **EmailService.java** | Send confirmation emails |

---

### 🗄️ repository/ - Database Access Layer

| Repository | Database Table |
|------------|----------------|
| **UserRepository.java** | `users` |
| **HotelRepository.java** | `hotels` |
| **RoomRepository.java** | `rooms` |
| **BookingRepository.java** | `bookings` |

---

### 📄 entity/ - Database Models

**User.java**
- id, email, password, firstName, lastName, phone, role

**Hotel.java**
- id, name, description, address, city, country, starRating, amenities

**Room.java**
- id, hotelId, roomType, price, capacity, isAvailable

**Booking.java**
- id, userId, roomId, checkInDate, checkOutDate, totalPrice, status

**Review.java**
- id, userId, hotelId, rating, comment, createdAt

### 📦 dto/ - Data Transfer Objects

#### request/ - Input DTOs

| File | Purpose |
|------|---------|
| **LoginRequest.java** | Email + Password for login |
| **RegisterRequest.java** | User registration data |
| **CreateHotelRequest.java** | New hotel creation |
| **UpdateHotelRequest.java** | Hotel update data |
| **CreateRoomRequest.java** | New room creation |
| **CreateBookingRequest.java** | Booking request data |
| **SearchRequest.java** | Search filters (city, dates, price) |

---

#### response/ - Output DTOs

| File | Purpose |
|------|---------|
| **AuthResponse.java** | JWT token + user info |
| **UserResponse.java** | User data (no password) |
| **HotelResponse.java** | Hotel data for frontend |
| **RoomResponse.java** | Room data with availability |
| **BookingResponse.java** | Booking confirmation data |
| **ApiResponse.java** | Generic API response wrapper |
| **PageResponse.java** | Paginated results wrapper |

---

### 🔄 mapper/ - Entity ↔ DTO Conversion

| Mapper | Converts |
|--------|----------|
| **UserMapper.java** | User Entity ↔ UserResponse |
| **HotelMapper.java** | Hotel Entity ↔ HotelResponse |
| **RoomMapper.java** | Room Entity ↔ RoomResponse |
| **BookingMapper.java** | Booking Entity ↔ BookingResponse |

**Why?** Never expose Entity directly to prevent security issues and coupling.

---

### 🔒 security/ - Security Components

| File | Purpose |
|------|---------|
| **JwtAuthenticationFilter.java** | Intercepts requests, validates JWT tokens |
| **JwtTokenProvider.java** | Generates and validates JWT tokens |
| **CustomUserDetailsService.java** | Loads user from database for authentication |
| **SecurityUtils.java** | Utility methods (get current user, etc.) |

---

### ⚠️ exception/ - Error Handling

| File | HTTP Status |
|------|-------------|
| **GlobalExceptionHandler.java** | Catches all exceptions globally |
| **ResourceNotFoundException.java** | 404 Not Found |
| **BadRequestException.java** | 400 Bad Request |
| **UnauthorizedException.java** | 401 Unauthorized |
| **BookingConflictException.java** | 409 Conflict |
| **ErrorResponse.java** | Standard error response format |

---

### ✅ validation/ - Custom Validators

#### validator/
- **DateRangeValidator.java** - Validates check-in < check-out dates
- **PhoneNumberValidator.java** - Validates phone format

#### annotation/
- **@ValidDateRange** - Custom annotation for date validation
- **@ValidPhoneNumber** - Custom annotation for phone validation

---

### 🛠️ util/ - Utility Classes

| File | Purpose |
|------|---------|
| **DateUtils.java** | Date calculations (nights between dates, etc.) |
| **Constants.java** | Application-wide constants |

---

## 📂 resources/ - Configuration & Database

### Configuration Files:

**application.yml** - Main configuration
**application-dev.yml** - Development environment
**application-prod.yml** - Production environment

### Database Migrations:

**db/migration/**
- V1__create_users_table.sql
- V2__create_hotels_table.sql
- V3__create_rooms_table.sql
- V4__create_bookings_table.sql

Flyway automatically runs these in order on startup.

---

## 🎯 Quick Reference: File Counts

| Layer | Number of Files | Purpose |
|-------|-----------------|---------|
| Controllers | 5 | API endpoints |
| Services | 6 | Business logic |
| Repositories | 4 | Database access |
| Entities | 5 + 3 enums | Data models |
| DTOs | 15 | Request/Response objects |
| Mappers | 4 | Entity-DTO conversion |
| Security | 4 | Authentication/Authorization |
| Exceptions | 6 | Error handling |
| Config | 5 | Application configuration |
| Validation | 4 | Custom validators |
| Utils | 2 | Helper functions |