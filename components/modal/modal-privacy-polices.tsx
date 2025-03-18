import { useEffect, useRef, useState } from "react";
import { PiScrollBold } from "react-icons/pi";
import { Dialog, DialogContent, DialogOverlay } from "../ui/dialog";

interface ModalPrivacyAndPoliciesProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  onAccept: () => void;
}

export function ModalPrivacyAndPolicies({
  open,
  onOpenChange,
  onClose,
  onAccept,
}: ModalPrivacyAndPoliciesProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [canClose, setCanClose] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
        if (scrollTop + clientHeight >= scrollHeight - 1) {
          setCanClose(true);
        }
      }
    };

    const contentDiv = contentRef.current;
    if (contentDiv) {
      contentDiv.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (contentDiv) {
        contentDiv.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const handleAccept = () => {
    onAccept();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-k-black bg-opacity-50 backdrop-blur-md">
        <DialogContent className="text-white lg:max-w-[525px] rounded-md border p-6 max-w-80">
          <div className="flex items-center justify-start gap-3 mt-3">
            <PiScrollBold size={30} />
            <h2 className="lg:text-2xl text-[1rem]">
              Políticas de Dados e Privacidade
            </h2>
          </div>
   
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
}
