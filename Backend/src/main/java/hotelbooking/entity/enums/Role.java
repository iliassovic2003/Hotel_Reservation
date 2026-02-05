package hotelbooking.entity.enums;

public enum Role {
    CUSTOMER,
    HOTEL_OWNER,
    ADMIN;
    
    public static Role fromString(String role)
    {
        try {
            return Role.valueOf(role.toUpperCase());
        } catch (IllegalArgumentException e) {
            return CUSTOMER;
        }
    }
}
