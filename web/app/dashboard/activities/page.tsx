"use client";

import { useQuery } from "@tanstack/react-query";

import { activitiesApi } from "@/lib/api/activities";

import { Card } from "@/components/ui/card";

import { ActivityIcon } from "@/components/activities/activity-icon";

export default function ActivitiesPage() {
  const { data: activities } = useQuery({
    queryKey: ["activities"],
    queryFn: activitiesApi.getActivities,
  });

  if (activities && activities.length === 0) {
    return <div>No activity yet</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Activity Feed</h1>

        <p className="text-muted-foreground">Recent operational events</p>
      </div>

      <div className="space-y-4">
        {activities?.map((activity: any) => (
          <Card key={activity.id} className="p-4">
            <div className="flex gap-4">
              <div className="mt-1">
                <ActivityIcon type={activity.type} />
              </div>

              <div className="flex-1">
                <p className="font-medium">{activity.message}</p>

                <p className="text-sm text-muted-foreground">
                  {new Date(activity.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
