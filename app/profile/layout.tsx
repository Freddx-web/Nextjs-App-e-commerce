import { UserProfileLayout } from '@/components/user-profile-layout';
// Profile layout component
export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UserProfileLayout>{children}</UserProfileLayout>;
}
