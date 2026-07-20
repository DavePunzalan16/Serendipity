export default function WalkDetailPage({
  params,
}: {
  params: { walkId: string };
}) {
  return (
    <main>
      <h1>Walk Detail</h1>
      <p>Walk ID: {params.walkId}</p>
      {/* TODO: Display full route map, stop list, narrative, photos, comments */}
    </main>
  );
}
