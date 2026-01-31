import { KidDetailsContent } from "@/features/users-management/parent-details/kid-details/kid-details-content"

interface KidDetailsPageProps {
  params: Promise<{
    kidId: string
  }>
}

export default async function KidDetailsPage({ params }: KidDetailsPageProps) {
  const { kidId } = await params

  return <KidDetailsContent kidId={kidId} />
}
