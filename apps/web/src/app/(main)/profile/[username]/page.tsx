export default function ProfilePage({
  params,
}: {
  params: { username: string };
}) {
  return (
    <main>
      <h1>Profile</h1>
      <p>@{params.username}</p>
      {/* TODO: Avatar, stats, badges, walk grid, follow/unfollow button */}
    </main>
  );
}
