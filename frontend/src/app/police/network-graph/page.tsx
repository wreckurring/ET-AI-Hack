'use client';

import React, { useState, useEffect } from 'react';
import Neo4jNetworkGraph from '@/components/Neo4jNetworkGraph';
import { fetchApi } from '@/lib/api';
import { NetworkGraphData } from '@/types';
import { Network, Layers, ShieldAlert, Cpu } from 'lucide-react';

export default function NetworkGraphPage() {
  const [graphData, setGraphData] = useState<NetworkGraphData>({
    nodes: [
      { id: "v1", label: "Ramesh Kumar (Victim)", group: "victim", title: "Loss: ₹1,85,000 | Ack: RK-2026-8801", riskScore: 10 },
      { id: "v2", label: "Priya Sharma (Victim)", group: "victim", title: "Loss: ₹3,40,000 | Ack: RK-2026-8802", riskScore: 10 },
      { id: "v3", label: "Dr. Anish Varma (Victim)", group: "victim", title: "Loss: ₹7,50,000 | Ack: RK-2026-8803", riskScore: 10 },
      { id: "v4", label: "Sneha Gupta (Victim)", group: "victim", title: "Loss: ₹95,000 | Ack: RK-2026-8804", riskScore: 10 },
      { id: "u1", label: "refund.sbi@okicici", group: "upi", title: "High Velocity Phishing UPI", riskScore: 95 },
      { id: "u2", label: "elect.bill.pay@ybl", group: "upi", title: "Fake Power Bill Phishing Handle", riskScore: 92 },
      { id: "u3", label: "task.reward99@paytm", group: "upi", title: "Telegram Investment Scam Handle", riskScore: 98 },
      { id: "p1", label: "+91 98351 90211 (Jamtara Call Hub)", group: "phone", title: "SIM Box active in Jamtara, Jharkhand", riskScore: 99 },
      { id: "p2", label: "+91 97182 44102 (Mewat WhatsApp)", group: "phone", title: "OLX Fake Army Officer Scam", riskScore: 94 },
      { id: "m1", label: "SBI Mule: 30489912041 (IFSC: SBIN0004921)", group: "mule_account", title: "Mule Branch: Deoghar | Status: FAST-FREEZE ACTIVE", riskScore: 96 },
      { id: "m2", label: "ICICI Mule: 018405009121 (IFSC: ICIC0000184)", group: "mule_account", title: "Mule Branch: Alwar | Status: SUSPICIOUS INFLOW", riskScore: 91 },
      { id: "m3", label: "Canara Mule: 110023489102 (IFSC: CNRB0001100)", group: "mule_account", title: "Crypto Off-ramp Mule Account", riskScore: 88 },
      { id: "ip1", label: "103.145.72.19 (VPN Gateway)", group: "ip", title: "Phishing Panel Hosting", riskScore: 85 },
      { id: "ip2", label: "45.132.227.10 (Telegram Bot Host)", group: "ip", title: "Automated OTP Grabber Server", riskScore: 90 }
    ],
    edges: [
      { from_node: "v1", to_node: "u1", label: "TRANSFERRED ₹1.85L" },
      { from_node: "v2", to_node: "u1", label: "TRANSFERRED ₹3.40L" },
      { from_node: "v3", to_node: "to3", label: "TRANSFERRED ₹7.50L" },
      { from_node: "v4", to_node: "u2", label: "TRANSFERRED ₹95K" },
      { from_node: "u1", to_node: "m1", label: "AUTO-SWEEP" },
      { from_node: "u2", to_node: "m2", label: "LAUNDERED TO" },
      { from_node: "u3", to_node: "m3", label: "CRYPTO CASH-OUT" },
      { from_node: "p1", to_node: "u1", label: "REGISTERED_BY" },
      { from_node: "p1", to_node: "u2", label: "CALLER_ORIGIN" },
      { from_node: "p2", to_node: "m2", label: "OPERATED_BY" },
      { from_node: "p1", to_node: "ip1", label: "HOSTED_ON" },
      { from_node: "u3", to_node: "ip2", label: "BOT_CONTROL" }
    ]
  });

  useEffect(() => {
    fetchApi<NetworkGraphData>('/graph/network')
      .then((data) => setGraphData(data))
      .catch(() => {});
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-cyan-500/20 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-violet-400">
            <Network className="h-4 w-4" />
            <span>NEO4J GRAPH DATABASE INTELLIGENCE LAYER</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Mule Account Ring Network Explorer</h1>
        </div>
      </div>

      <Neo4jNetworkGraph graphData={graphData} />
    </div>
  );
}
