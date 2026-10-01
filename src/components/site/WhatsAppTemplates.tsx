import { MessageCircle } from "lucide-react";

import { whatsappLink, whatsappTemplates } from "@/lib/site";

export function WhatsAppTemplates({ heading = "Quick WhatsApp messages" }: { heading?: string }) {
  return (
    <div>
      <p className="text-sm font-medium text-foreground">{heading}</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Tap one and we'll prefill the message for you — just fill in the blanks and send.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {whatsappTemplates.map((template) => (
          <a
            key={template.label}
            href={whatsappLink(template.message)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-background px-4 py-2 text-sm text-foreground transition-colors hover:border-primary hover:bg-accent"
          >
            <MessageCircle className="h-4 w-4 text-primary" aria-hidden="true" />
            {template.label}
          </a>
        ))}
      </div>
    </div>
  );
}
