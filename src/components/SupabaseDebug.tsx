import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const SupabaseDebug: React.FC = () => {
  const [status, setStatus] = useState<{
    connection: "checking" | "connected" | "error";
    auth: "checking" | "working" | "error";
    session: any;
    table_profiles: "checking" | "working" | "error";
    table_orgs: "checking" | "working" | "error";
    edgeFunctions: "checking" | "working" | "error";
    edgeFunctionDetails: {
      checkout: "checking" | "working" | "error";
      createOrg: "checking" | "working" | "error";
      stripeWebhook: "checking" | "working" | "error";
    };
    errors: string[];
  }>({
    connection: "checking",
    auth: "checking",
    session: null,
    table_profiles: "checking",
    table_orgs: "checking",
    edgeFunctions: "checking",
    edgeFunctionDetails: {
      checkout: "checking",
      createOrg: "checking",
      stripeWebhook: "checking",
    },
    errors: [],
  });

  const addError = (error: string) => {
    setStatus(prev => ({
      ...prev,
      errors: [...prev.errors, error]
    }));
  };

  const testEdgeFunction = async (functionName: string) => {
    try {
      const functionUrl = `https://wdclgadjetxhcududipz.supabase.co/functions/v1/${functionName}`;
      console.log(`Testing ${functionName} at:`, functionUrl);
      
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabase.supabaseKey}`,
        },
        body: JSON.stringify({ test: true }),
      });

      console.log(`${functionName} response:`, response.status, response.statusText);
      
      if (response.status === 200 || response.status === 400 || response.status === 401) {
        // Function exists and is responding
        return "working";
      } else {
        addError(`${functionName}: HTTP ${response.status} - ${response.statusText}`);
        return "error";
      }
    } catch (error) {
      const errorMsg = `${functionName}: ${error}`;
      console.error(errorMsg);
      addError(errorMsg);
      return "error";
    }
  };

  useEffect(() => {
    const checkStatus = async () => {
      // Test connection
      try {
        const { data, error } = await supabase.from("profiles").select("count").limit(1);
        if (error) throw error;
        setStatus(prev => ({ ...prev, connection: "connected" }));
      } catch (error) {
        setStatus(prev => ({ ...prev, connection: "error" }));
        addError(`Connection: ${error}`);
      }

      // Test auth
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        setStatus(prev => ({ 
          ...prev, 
          auth: "working",
          session: session
        }));
      } catch (error) {
        setStatus(prev => ({ ...prev, auth: "error" }));
        addError(`Auth: ${error}`);
      }

      // Test profiles table
      try {
        const { data, error } = await supabase.from("profiles").select("*").limit(1);
        if (error) throw error;
        setStatus(prev => ({ ...prev, table_profiles: "working" }));
      } catch (error) {
        setStatus(prev => ({ ...prev, table_profiles: "error" }));
        addError(`Profiles table: ${error}`);
      }

      // Test orgs table
      try {
        const { data, error } = await supabase.from("orgs").select("*").limit(1);
        if (error) throw error;
        setStatus(prev => ({ ...prev, table_orgs: "working" }));
      } catch (error) {
        setStatus(prev => ({ ...prev, table_orgs: "error" }));
        addError(`Orgs table: ${error}`);
      }

      // Test Edge Functions individually
      const checkoutStatus = await testEdgeFunction("checkout");
      const createOrgStatus = await testEdgeFunction("create-org");
      const stripeWebhookStatus = await testEdgeFunction("stripe-webhook");

      setStatus(prev => ({
        ...prev,
        edgeFunctionDetails: {
          checkout: checkoutStatus,
          createOrg: createOrgStatus,
          stripeWebhook: stripeWebhookStatus,
        },
        edgeFunctions: (checkoutStatus === "working" && createOrgStatus === "working" && stripeWebhookStatus === "working") 
          ? "working" 
          : "error"
      }));
    };

    checkStatus();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
      case "working":
        return "✅";
      case "error":
        return "❌";
      case "checking":
        return "⏳";
      default:
        return "❓";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
      case "working":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      case "checking":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🔧 Supabase Debug Panel</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Badge className={getStatusColor(status.connection)}>
                {getStatusIcon(status.connection)} connection
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={getStatusColor(status.auth)}>
                {getStatusIcon(status.auth)} auth
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={getStatusColor(status.table_profiles)}>
                {getStatusIcon(status.table_profiles)} table_profiles
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={getStatusColor(status.table_orgs)}>
                {getStatusIcon(status.table_orgs)} table_orgs
              </Badge>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Edge Functions:</h3>
            <div className="grid grid-cols-3 gap-2">
              <Badge className={getStatusColor(status.edgeFunctionDetails.checkout)}>
                {getStatusIcon(status.edgeFunctionDetails.checkout)} checkout
              </Badge>
              <Badge className={getStatusColor(status.edgeFunctionDetails.createOrg)}>
                {getStatusIcon(status.edgeFunctionDetails.createOrg)} create-org
              </Badge>
              <Badge className={getStatusColor(status.edgeFunctionDetails.stripeWebhook)}>
                {getStatusIcon(status.edgeFunctionDetails.stripeWebhook)} stripe-webhook
              </Badge>
            </div>
          </div>

          {status.session && (
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">Session:</h3>
              <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                {JSON.stringify(status.session, null, 2)}
              </pre>
            </div>
          )}

          {status.errors.length > 0 && (
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2 text-red-600">Errors:</h3>
              <div className="space-y-1">
                {status.errors.map((error, index) => (
                  <div key={index} className="text-xs text-red-600 bg-red-50 p-2 rounded">
                    {error}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border-t pt-4">
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline"
              className="w-full"
            >
              🔄 Refresh Status
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupabaseDebug;
