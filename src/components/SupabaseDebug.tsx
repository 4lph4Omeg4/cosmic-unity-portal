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
      console.log(`Testing ${functionName}...`);
      
      // Use Supabase client's functions method instead of direct fetch
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: { test: true },
        method: 'POST'
      });

      console.log(`${functionName} response:`, { data, error });
      
      if (error) {
        // If we get an error but it's not a "function not found" error, the function exists
        if (error.message.includes('function') && error.message.includes('not found')) {
          addError(`${functionName}: Function not found`);
          return "error";
        } else {
          // Function exists but returned an error (expected for test data)
          console.log(`${functionName} exists but returned error (expected):`, error.message);
          return "working";
        }
      } else {
        // Function exists and worked
        return "working";
      }
    } catch (error: any) {
      const errorMsg = `${functionName}: ${error.message || error}`;
      console.error(errorMsg);
      
      // Check if it's a network/CORS error
      if (error.message?.includes('fetch') || error.message?.includes('Failed to fetch')) {
        addError(`${functionName}: Network/CORS error - function may exist but not accessible from browser`);
        return "error";
      }
      
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

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Manual Tests:</h3>
            <div className="space-y-2">
              <Button 
                onClick={async () => {
                  try {
                    console.log("Testing create-org manually...");
                    const response = await fetch('https://wdclgadjetxhcududipz.supabase.co/functions/v1/create-org', {
                      method: 'OPTIONS',
                      headers: {
                        'Origin': window.location.origin,
                      }
                    });
                    console.log("OPTIONS response:", response.status, response.headers);
                    
                    const response2 = await fetch('https://wdclgadjetxhcududipz.supabase.co/functions/v1/create-org', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkY2xnYWRqZXR4aGN1ZHVkaXB6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0ODMwNDUsImV4cCI6MjA2OTA1OTA0NX0.5hWgUyRpqwwqNIBFCJqjF68_6zxN65Q43d0ziA2Qleo',
                      },
                      body: JSON.stringify({ name: 'Test Company' })
                    });
                    console.log("POST response:", response2.status, response2.statusText);
                    const text = await response2.text();
                    console.log("Response body:", text);
                  } catch (error) {
                    console.error("Manual test error:", error);
                  }
                }}
                variant="outline"
                size="sm"
                className="w-full"
              >
                🧪 Test create-org manually
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupabaseDebug;
