import { feedPosts, suggestedConnections } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tag } from "@/components/ui/tag";

export function DefaultRightRail() {
  return (
    <>
      <Card className="space-y-3">
        <h3 className="text-lg font-semibold">Trending in NIT Delhi</h3>
        <div className="flex flex-wrap gap-2">
          <Tag>Internships</Tag>
          <Tag>DBMS Viva</Tag>
          <Tag>OS Lab</Tag>
          <Tag>DSA Sheets</Tag>
        </div>
      </Card>
      <Card className="space-y-4">
        <h3 className="text-lg font-semibold">Suggested Connections</h3>
        {suggestedConnections.map((person) => (
          <div key={person.name} className="flex items-center justify-between gap-3">
            <div>
              <p className="font-medium">{person.name}</p>
              <p className="text-xs text-textMuted">
                {person.field} • {person.mutuals} mutuals
              </p>
            </div>
            <Button variant="secondary" className="px-3 py-1.5 text-xs">
              Connect
            </Button>
          </div>
        ))}
      </Card>
      <Card className="space-y-3">
        <h3 className="text-lg font-semibold">Top Unanswered</h3>
        {feedPosts.slice(0, 2).map((post) => (
          <div key={post.id} className="space-y-1">
            <p className="text-sm font-medium">{post.title}</p>
            <p className="text-xs text-textMuted">{post.comments} replies so far</p>
          </div>
        ))}
      </Card>
    </>
  );
}
