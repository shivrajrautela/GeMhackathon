import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Activity, ShieldCheck, AlertTriangle, FileSearch, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function OfficerAuditLogsPage() {
  let auditLogs = [];

  try {
    const auditRes = await fetch('http://localhost:5000/api/audit-logs', { cache: 'no-store' });
    const auditJson = await auditRes.json();
    if (auditJson.success) {
      auditLogs = auditJson.data.map((log: any) => ({
        id: log.id,
        time: new Date(log.created_at).toLocaleString(),
        user: 'AI Engine',
        event: log.action,
        details: `SHA-256 Hash: ${log.sha256_hash}`,
        severity: log.action.includes('VERIFIED') ? 'Info' : 'High'
      }));
    }
  } catch (error) {
    console.error("Failed to fetch from backend", error);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Cryptographic Audit Logs</h2>
          <p className="text-slate-600 mt-1">Immutable record of all AI verifications, API calls, and officer actions.</p>
        </div>
        <Button variant="outline" className="flex items-center">
          <Filter className="mr-2 h-4 w-4" /> Filter Logs
        </Button>
      </div>

      <Card className="shadow-md">
        <CardHeader className="bg-slate-50 border-b pb-4">
          <CardTitle className="flex items-center">
            <Activity className="mr-2 h-5 w-5 text-slate-700" />
            Global Activity Feed
          </CardTitle>
          <CardDescription>Chronological events across all active tenders, secured by SHA-256 hashes.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Actor / Source</TableHead>
                <TableHead>Event Type</TableHead>
                <TableHead>Cryptographic Hash</TableHead>
                <TableHead>Severity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLogs.map((log: any) => (
                <TableRow key={log.id}>
                  <TableCell className="text-slate-500 whitespace-nowrap text-xs">{log.time}</TableCell>
                  <TableCell className="font-medium text-slate-700">{log.user}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {log.severity === 'High' && <AlertTriangle className="mr-2 h-4 w-4 text-red-500" />}
                      {log.severity === 'Info' && <FileSearch className="mr-2 h-4 w-4 text-blue-500" />}
                      {log.severity === 'Medium' && <ShieldCheck className="mr-2 h-4 w-4 text-orange-500" />}
                      {log.event}
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-600 font-mono text-xs">{log.details}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={
                      log.severity === 'High' ? 'bg-red-100 text-red-800' : 
                      log.severity === 'Medium' ? 'bg-orange-100 text-orange-800' : 
                      'bg-slate-100 text-slate-800'
                    }>
                      {log.severity}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
