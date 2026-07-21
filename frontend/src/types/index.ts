export interface EvidenceFile {
  id: number;
  file_name: string;
  file_type: string;
  file_size: number;
  sha256_hash: string;
  hash_verified: boolean;
  uploaded_at: string;
}

export interface FraudReport {
  id: number;
  ack_number: string;
  victim_name: string;
  victim_phone: string;
  victim_email?: string;
  victim_state: string;
  victim_district: string;
  category: string;
  amount_lost: number;
  utr_number?: string;
  target_upi_id?: string;
  target_ifsc?: string;
  target_account_no?: string;
  scammer_phone?: string;
  scammer_url_app?: string;
  scammer_ip_address?: string;
  latitude?: number;
  longitude?: number;
  location_address?: string;
  description: string;
  status: 'NEW' | 'INVESTIGATING' | 'FAST_FREEZE_REQUESTED' | 'FROZEN' | 'RESOLVED';
  risk_score: number;
  is_frozen: boolean;
  created_at: string;
  evidence_files?: EvidenceFile[];
}

export interface HotspotPoint {
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  report_count: number;
  total_amount: number;
  risk_level: 'CRITICAL' | 'HIGH' | 'MEDIUM';
}

export interface GraphNode {
  id: string;
  label: string;
  group: string;
  title: string;
  riskScore: number;
}

export interface GraphEdge {
  from_node: string;
  to_node: string;
  label: string;
}

export interface NetworkGraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}
