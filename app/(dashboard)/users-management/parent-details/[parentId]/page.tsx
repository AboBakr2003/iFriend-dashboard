import { ParentDetailsContent } from "@/features/users-management/parent-details/parent-details-content"

interface ParentDetailsPageProps {
  params: Promise<{
    parentId: string;
  }>
}

export default async function ParentDetailsPage({ params }: ParentDetailsPageProps) {
  const { parentId } = await params
  return <ParentDetailsContent parentId={parentId} />
}
