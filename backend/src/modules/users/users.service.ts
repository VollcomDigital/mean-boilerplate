import { User, type IUser } from './user.model.js';
import { NotFoundError, ConflictError } from '../../utils/app-error.js';
import type { UpdateUserDto } from './users.validation.js';

interface PaginationOptions {
  page: number;
  limit: number;
}

interface PaginatedResult<T> {
  items: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface UserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

function toUserResponse(user: IUser): UserResponse {
  return {
    id: user._id.toString(),
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

/**
 * Fetch a paginated list of active users.
 *
 * Args:
 *   options: Pagination options (page, limit).
 *
 * Returns:
 *   Paginated user list with metadata.
 *
 * Time Complexity: O(n) where n = limit
 */
export async function findAllUsers(
  options: PaginationOptions,
): Promise<PaginatedResult<UserResponse>> {
  const { page, limit } = options;
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find({ isActive: true }).skip(skip).limit(limit).sort({ createdAt: -1 }),
    User.countDocuments({ isActive: true }),
  ]);

  return {
    items: users.map(toUserResponse),
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Find a single user by ID.
 *
 * Args:
 *   id: MongoDB ObjectId string.
 *
 * Returns:
 *   User response object.
 *
 * Raises:
 *   NotFoundError: If user does not exist.
 */
export async function findUserById(id: string): Promise<UserResponse> {
  const user = await User.findById(id);
  if (!user) {
    throw new NotFoundError('User');
  }
  return toUserResponse(user);
}

/**
 * Update a user by ID.
 *
 * Args:
 *   id: MongoDB ObjectId string.
 *   dto: Partial user update fields.
 *
 * Returns:
 *   Updated user response.
 *
 * Raises:
 *   NotFoundError: If user does not exist.
 *   ConflictError: If the new email is already taken.
 */
export async function updateUserById(id: string, dto: UpdateUserDto): Promise<UserResponse> {
  if (dto.email) {
    const existing = await User.findOne({ email: dto.email, _id: { $ne: id } });
    if (existing) {
      throw new ConflictError('Email already in use');
    }
  }

  const user = await User.findByIdAndUpdate(id, dto, { new: true, runValidators: true });
  if (!user) {
    throw new NotFoundError('User');
  }
  return toUserResponse(user);
}

/**
 * Soft-delete a user by setting isActive to false.
 *
 * Args:
 *   id: MongoDB ObjectId string.
 *
 * Raises:
 *   NotFoundError: If user does not exist.
 */
export async function deleteUserById(id: string): Promise<void> {
  const user = await User.findByIdAndUpdate(id, { isActive: false }, { new: true });
  if (!user) {
    throw new NotFoundError('User');
  }
}
