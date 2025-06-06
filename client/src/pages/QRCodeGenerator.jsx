import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import socket from "../utils/socket";

export default function generateQR({ classroomId }) {
  const [qrUrl, setQrUrl] = useState("");
  const [sessionActive, setSessionActive] = useState(false);

  const startQRSession = () => {
    if (!classroomId) {
      console.error("classroomId is undefined. Cannot start session.");
      return;
    }
    console.log("Starting QR session for classroomId:", classroomId);
    socket.emit("start-qr", { classroomId });
    setSessionActive(true);
  };

  const stopQRSession = () => {
    if (!classroomId) return;
    console.log("Stopping QR session for classroomId:", classroomId);
    socket.emit("stop-qr", { classroomId });
    setSessionActive(false);
    setQrUrl("");
  };

  useEffect(() => {
    const handleQrUpdate = async ({ qrString }) => {
      try {
        const url = await QRCode.toDataURL(qrString);
        setQrUrl(url);
      } catch (err) {
        console.error("QR code generation failed:", err);
      }
    };

    if (socket && socket.connected) {
      console.log("Socket connected:", socket.id);
    } else {
      console.warn("Socket not connected. QR updates may not work.");
    }

    socket.on("qr-update", handleQrUpdate);
    return () => socket.off("qr-update", handleQrUpdate);
  }, []);

  return (
    <div className="text-sm">
      {!sessionActive ? (
        <button
          onClick={startQRSession}
          className="w-full bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
        >
          Start QR Session
        </button>
      ) : (
        <button
          onClick={stopQRSession}
          className="w-full bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Stop QR Session
        </button>
      )}

      {qrUrl && (
        <div className="mt-2 text-center">
          <img src={qrUrl} alt="QR Code" className="w-440 h-440 mx-auto" />
        </div>
      )}
    </div>
  );
}
