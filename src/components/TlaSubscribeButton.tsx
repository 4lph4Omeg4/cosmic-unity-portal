import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type Props = {
  orgId?: string;
  priceId: string;
  className?: string;
  children?: React.ReactNode;
  variant?: "default" | "trust";
};

export function TlaSubscribeButton({ orgId, priceId, className, children, variant = "default" }: Props) {
  const [loading, setLoading] = useState(false);
  const [showCompanyDialog, setShowCompanyDialog] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [creatingOrg, setCreatingOrg] = useState(false);

  async function createOrganization(name: string) {
    try {
      setCreatingOrg(true);
      
      const endpoint = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-org`;
      
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
        }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Organization creation failed: ${res.status} ${txt}`);
      }

      const { org_id } = await res.json();
      return org_id;
    } catch (err) {
      console.error("[TlaSubscribeButton] create org error", err);
      throw err;
    } finally {
      setCreatingOrg(false);
    }
  }

  async function handleClick() {
    try {
      setLoading(true);

      let finalOrgId = orgId;

      // If no orgId provided, show company name dialog
      if (!finalOrgId) {
        setShowCompanyDialog(true);
        return;
      }

      await startCheckout(finalOrgId);
    } catch (err) {
      console.error("[TlaSubscribeButton] error", err);
      alert("Kon checkout niet starten");
    } finally {
      setLoading(false);
    }
  }

  async function handleCompanySubmit() {
    try {
      if (!companyName.trim()) {
        alert("Voer een bedrijfsnaam in");
        return;
      }

      // Create organization first
      const newOrgId = await createOrganization(companyName);
      
      // Start checkout with new org
      await startCheckout(newOrgId);
      
      setShowCompanyDialog(false);
      setCompanyName("");
    } catch (err) {
      console.error("[TlaSubscribeButton] company submit error", err);
      alert("Kon organisatie niet aanmaken");
    }
  }

  async function startCheckout(orgId: string) {
    // ✅ Je Supabase Edge Function endpoint
    const endpoint = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/checkout`;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        price_id: priceId,
        org_id: orgId,
      }),
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Checkout request failed: ${res.status} ${txt}`);
    }

    const { url } = await res.json();

    if (url) {
      window.location.href = url;
    }
  }

  const buttonContent = loading ? "Even geduld…" : children ?? "Abonneer op Timeline Alchemy";

  return (
    <>
      <Button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={className}
        variant={variant === "trust" ? "default" : "default"}
        size="lg"
      >
        {buttonContent}
      </Button>

      <Dialog open={showCompanyDialog} onOpenChange={setShowCompanyDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Bedrijfsnaam invoeren</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="company-name">Bedrijfsnaam</Label>
              <Input
                id="company-name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Jouw bedrijfsnaam"
                onKeyPress={(e) => e.key === "Enter" && handleCompanySubmit()}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCompanyDialog(false);
                  setCompanyName("");
                  setLoading(false);
                }}
              >
                Annuleren
              </Button>
              <Button
                onClick={handleCompanySubmit}
                disabled={creatingOrg || !companyName.trim()}
              >
                {creatingOrg ? "Aanmaken..." : "Doorgaan naar betaling"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
