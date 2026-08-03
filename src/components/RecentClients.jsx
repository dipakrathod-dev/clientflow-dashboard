import { motion } from "framer-motion";
import { clientsData } from "../data/clients";
import SectionCard from "./SectionCard";
import StatusBadge from "./StatusBadge";

export default function RecentClients() {
  return (
    <SectionCard
      title="Recent Clients"
      icon="👥"
      actionText="View All →"
      onActionClick={() => console.log("Navigate to all clients")}
    >
      <div className="space-y-3">
        {clientsData.map((client) => (
          <motion.div
            key={client.id}
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="flex items-center justify-between p-3.5 bg-slate-800/40 rounded-xl border border-slate-800 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 transition-colors cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <img
                src={client.avatar}
                alt={client.name}
                className="w-10 h-10 rounded-full bg-slate-700/50 p-0.5 border border-slate-700"
              />
              <div>
                <p className="text-sm font-semibold text-white">{client.name}</p>
                <p className="text-xs text-slate-400">{client.service}</p>
              </div>
            </div>
            <StatusBadge status={client.status} />
          </motion.div>
        ))}
      </div>
    </SectionCard>
  );
}