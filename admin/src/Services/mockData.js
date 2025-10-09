// Mock data service for admin dashboard
// This simulates backend API responses

export const mockAdmin = {
  id: '1',
  email: 'admin@foodbridge.com',
  name: 'FoodBridge Admin',
  userType: 'admin',
  isVerified: true
};

export const mockUsers = [
  {
    id: 'user-1',
    email: 'pizza.palace@restaurant.com',
    name: 'Pizza Palace',
    user_type: 'restaurant',
    phone: '9876543210',
    location: 'Mumbai, Maharashtra',
    is_verified: true,
    is_active: true,
    created_at: '2025-01-15T10:30:00Z'
  },
  {
    id: 'user-2',
    email: 'tasty.bites@restaurant.com',
    name: 'Tasty Bites Restaurant',
    user_type: 'restaurant',
    phone: '9876543211',
    location: 'Delhi, India',
    is_verified: false,
    is_active: true,
    created_at: '2025-02-01T14:20:00Z'
  },
  {
    id: 'user-3',
    email: 'akshaya.patra@ngo.org',
    name: 'Akshaya Patra Foundation',
    user_type: 'ngo',
    phone: '9876543212',
    location: 'Bangalore, Karnataka',
    is_verified: true,
    is_active: true,
    created_at: '2025-01-20T09:15:00Z'
  },
  {
    id: 'user-4',
    email: 'food.for.all@ngo.org',
    name: 'Food For All NGO',
    user_type: 'ngo',
    phone: '9876543213',
    location: 'Pune, Maharashtra',
    is_verified: false,
    is_active: true,
    created_at: '2025-02-05T11:45:00Z'
  },
  {
    id: 'user-5',
    email: 'spice.garden@restaurant.com',
    name: 'Spice Garden',
    user_type: 'restaurant',
    phone: '9876543214',
    location: 'Chennai, Tamil Nadu',
    is_verified: true,
    is_active: false,
    created_at: '2025-01-10T16:00:00Z'
  },
  {
    id: 'user-6',
    email: 'helping.hands@ngo.org',
    name: 'Helping Hands NGO',
    user_type: 'ngo',
    phone: '9876543215',
    location: 'Kolkata, West Bengal',
    is_verified: true,
    is_active: true,
    created_at: '2025-01-25T13:30:00Z'
  }
];

export const mockDonations = [
  {
    id: 'donation-1',
    food_type: 'Cooked Rice',
    quantity: '10 kg',
    quantity_kg: 10,
    status: 'completed',
    restaurant_id: 'user-1',
    restaurant_name: 'Pizza Palace',
    restaurant_email: 'pizza.palace@restaurant.com',
    ngo_id: 'user-3',
    ngo_name: 'Akshaya Patra Foundation',
    ngo_email: 'akshaya.patra@ngo.org',
    created_at: '2025-02-10T10:00:00Z',
    pickup_time: '2025-02-10T14:00:00Z',
    expiry_time: '2025-02-10T18:00:00Z'
  },
  {
    id: 'donation-2',
    food_type: 'Vegetables',
    quantity: '5 kg',
    quantity_kg: 5,
    status: 'active',
    restaurant_id: 'user-1',
    restaurant_name: 'Pizza Palace',
    restaurant_email: 'pizza.palace@restaurant.com',
    ngo_id: null,
    ngo_name: null,
    ngo_email: null,
    created_at: '2025-02-11T09:30:00Z',
    pickup_time: '2025-02-11T15:00:00Z',
    expiry_time: '2025-02-11T19:00:00Z'
  },
  {
    id: 'donation-3',
    food_type: 'Bread & Bakery',
    quantity: '15 kg',
    quantity_kg: 15,
    status: 'completed',
    restaurant_id: 'user-5',
    restaurant_name: 'Spice Garden',
    restaurant_email: 'spice.garden@restaurant.com',
    ngo_id: 'user-6',
    ngo_name: 'Helping Hands NGO',
    ngo_email: 'helping.hands@ngo.org',
    created_at: '2025-02-08T08:00:00Z',
    pickup_time: '2025-02-08T12:00:00Z',
    expiry_time: '2025-02-08T16:00:00Z'
  },
  {
    id: 'donation-4',
    food_type: 'Cooked Meals',
    quantity: '20 kg',
    quantity_kg: 20,
    status: 'claimed',
    restaurant_id: 'user-1',
    restaurant_name: 'Pizza Palace',
    restaurant_email: 'pizza.palace@restaurant.com',
    ngo_id: 'user-3',
    ngo_name: 'Akshaya Patra Foundation',
    ngo_email: 'akshaya.patra@ngo.org',
    created_at: '2025-02-11T11:00:00Z',
    pickup_time: '2025-02-11T16:00:00Z',
    expiry_time: '2025-02-11T20:00:00Z'
  },
  {
    id: 'donation-5',
    food_type: 'Fruits',
    quantity: '8 kg',
    quantity_kg: 8,
    status: 'active',
    restaurant_id: 'user-5',
    restaurant_name: 'Spice Garden',
    restaurant_email: 'spice.garden@restaurant.com',
    ngo_id: null,
    ngo_name: null,
    ngo_email: null,
    created_at: '2025-02-11T07:00:00Z',
    pickup_time: '2025-02-11T13:00:00Z',
    expiry_time: '2025-02-11T17:00:00Z'
  },
  {
    id: 'donation-6',
    food_type: 'Dairy Products',
    quantity: '12 kg',
    quantity_kg: 12,
    status: 'completed',
    restaurant_id: 'user-1',
    restaurant_name: 'Pizza Palace',
    restaurant_email: 'pizza.palace@restaurant.com',
    ngo_id: 'user-6',
    ngo_name: 'Helping Hands NGO',
    ngo_email: 'helping.hands@ngo.org',
    created_at: '2025-02-09T10:30:00Z',
    pickup_time: '2025-02-09T14:30:00Z',
    expiry_time: '2025-02-09T18:30:00Z'
  }
];

export const mockStats = {
  total_restaurants: 3,
  total_ngos: 3,
  total_donations: 6,
  active_donations: 2,
  completed_donations: 3,
  total_food_saved: 70,
  pending_verifications: 2
};

export const mockMonthlyTrends = [
  { month: '2025-02-01', donation_count: 4, food_saved_kg: 55 },
  { month: '2025-01-01', donation_count: 2, food_saved_kg: 15 }
];

// Mock API functions
export const mockAuthAPI = {
  login: async (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === 'admin@foodbridge.com' && password === 'admin123') {
          resolve({
            token: 'mock-jwt-token-' + Date.now(),
            user: mockAdmin
          });
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 500);
    });
  },
  
  logout: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ message: 'Logged out successfully' });
      }, 200);
    });
  }
};

export const mockAdminAPI = {
  getDashboard: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          stats: mockStats,
          recentDonations: mockDonations.slice(0, 5),
          monthlyTrends: mockMonthlyTrends
        });
      }, 500);
    });
  },
  
  getAllUsers: async ({ page = 1, limit = 20, userType = null, isVerified = null }) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filteredUsers = [...mockUsers];
        
        if (userType) {
          filteredUsers = filteredUsers.filter(u => u.user_type === userType);
        }
        
        if (isVerified !== null) {
          filteredUsers = filteredUsers.filter(u => u.is_verified === isVerified);
        }
        
        const start = (page - 1) * limit;
        const end = start + limit;
        const paginatedUsers = filteredUsers.slice(start, end);
        
        resolve({
          users: paginatedUsers,
          total: filteredUsers.length,
          page,
          totalPages: Math.ceil(filteredUsers.length / limit)
        });
      }, 500);
    });
  },
  
  verifyUser: async (userId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = mockUsers.find(u => u.id === userId);
        if (user) {
          user.is_verified = true;
        }
        resolve({ message: 'User verified successfully' });
      }, 500);
    });
  },
  
  toggleUserStatus: async (userId, isActive) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = mockUsers.find(u => u.id === userId);
        if (user) {
          user.is_active = isActive;
        }
        resolve({ message: `User ${isActive ? 'activated' : 'deactivated'} successfully` });
      }, 500);
    });
  },
  
  deleteUser: async (userId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockUsers.findIndex(u => u.id === userId);
        if (index > -1) {
          mockUsers.splice(index, 1);
        }
        resolve({ message: 'User deleted successfully' });
      }, 500);
    });
  },
  
  getAllDonations: async ({ page = 1, limit = 20, status = null }) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filteredDonations = [...mockDonations];
        
        if (status) {
          filteredDonations = filteredDonations.filter(d => d.status === status);
        }
        
        const start = (page - 1) * limit;
        const end = start + limit;
        const paginatedDonations = filteredDonations.slice(start, end);
        
        resolve({
          donations: paginatedDonations,
          total: filteredDonations.length,
          page,
          totalPages: Math.ceil(filteredDonations.length / limit)
        });
      }, 500);
    });
  }
};