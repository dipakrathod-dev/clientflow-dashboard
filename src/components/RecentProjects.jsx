import { motion } from "framer-motion";
import { projectsData } from "../data/projects";
import SectionCard from "./SectionCard";

export default function RecentProjects() {
  return (
    <SectionCard
      title="Recent Projects"
      icon="📁"
      actionText="Manage →"
      onActionClick={() => console.log("Navigate to project management")}
    >
      <div className="space-y-5">
        {projectsData.map((project) => (
          <div key={project.id} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-semibold text-slate-100">{project.title}</span>
              <span className="text-slate-400 font-medium">{project.progress}%</span>
            </div>
            
            <div className="w-full bg-slate-800/80 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${project.progress}%` }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full"
              />
            </div>
            
            <p className="text-xs text-slate-400">Deadline: {project.deadline}</p>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}