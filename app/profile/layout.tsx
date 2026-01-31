import { UserProfileLayout } from '@/components/user-profile-layout';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UserProfileLayout>{children}</UserProfileLayout>;
}
