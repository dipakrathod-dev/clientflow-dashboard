import { activitiesData } from "../data/activities";
import SectionCard from "./SectionCard";

export default function ActivityFeed() {
  return (
    <SectionCard title="Recent Activity" icon="⚡">
      <div className="relative pl-6 border-l-2 border-slate-800 space-y-6 my-2">
        {activitiesData.map((act) => (
          <div key={act.id} className="relative group">
            <div className="absolute -left-[31px] top-0 bg-slate-900 p-1 text-sm rounded-full border border-slate-700">
              {act.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-200">{act.text}</p>
              <span className="text-xs text-slate-500">{act.time}</span>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}