import { Privacy, Role } from '@prisma/client';
import { Event } from 'src/event/event.model';
import { User } from 'src/user/user.model';

export const isUserAllowed = (event: Event, user: User) => {
  const { role } = user;
  const { privacy } = event;
  if (role === Role.ADMIN || role === Role.RESIDENT) {
    return true;
  }

  if (role === Role.ALUMNI) {
    return privacy !== Privacy.RESIDENT;
  }

  return privacy === Privacy.PUBLIC;
};
