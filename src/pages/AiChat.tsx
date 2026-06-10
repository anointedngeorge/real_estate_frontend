
import { PageHeader } from '@/components/layout/PageHeader';
import "../n8nchat.css"
import {
  mockDashboardStats,
} from '@/data/mockData';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEffect } from 'react';
import '@n8n/chat/style.css';
import { createChat } from '@n8n/chat';



export default function AiChatPage() {
  const stats = mockDashboardStats;
  const WEBHOOK_URL = 'https://n8n.sharashelltechnology.com/webhook/4043e9b7-fe33-4a1c-b5c9-c22dae1771bf/chat'
  useEffect(() => {
		createChat({
			webhookUrl: WEBHOOK_URL,
      mode: 'fullscreen',
      target: '#chat',
      showWelcomeScreen: true,
		});
	}, []);
  

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Ai Chat"
        description="Welcome To AI Chat Platform"
      >
        <Select defaultValue="30">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
          </SelectContent>
        </Select>
      </PageHeader>

      {/* overview */}
      <div id='chat'></div>
    </div>
  );
}
