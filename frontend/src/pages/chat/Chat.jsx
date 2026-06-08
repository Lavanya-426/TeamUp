import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Layout from "../../components/common/Layout";
import socket, { connectSocket } from "../../services/socket";
import api from "../../services/api";

const mergeMessagesById = (existing, incoming) => {
  const map = new Map();

  for (const m of existing) {
    const key = m._id || `${m.senderId}:${m.createdAt}:${m.text}`;
    map.set(key, m);
  }

  for (const m of incoming) {
    const key = m._id || `${m.senderId}:${m.createdAt}:${m.text}`;
    map.set(key, m);
  }

  return Array.from(map.values()).sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
  );
};

function Chat() {
  const { id: teamId } = useParams();
  const location = useLocation();
  const initialTeamName = location.state?.teamName;

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [teamName] = useState(initialTeamName || "");
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [initialLoaded, setInitialLoaded] = useState(false);

  const containerRef = useRef(null);
  const bottomRef = useRef(null);
  const seenTimeoutRef = useRef(null);
  const prevTeamRef = useRef(null);

  const scrollToBottom = (smooth = true) => {
    bottomRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
    });
  };

  const isNearBottom = () => {
    const el = containerRef.current;
    if (!el) return true;
    return el.scrollHeight - el.scrollTop - el.clientHeight < 100;
  };

  const emitSeen = () => {
    if (!teamId) return;
    clearTimeout(seenTimeoutRef.current);

    seenTimeoutRef.current = setTimeout(() => {
      socket.emit("mark_seen", { teamId });
    }, 400);
  };

  const handleScroll = () => {
    if (isNearBottom()) {
      setHasNewMessage(false);
      emitSeen();
    }
  };

  const currentUserId = useMemo(() => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      return decoded.id;
    } catch {
      return null;
    }
  }, []);

  const getDateLabel = (date) => {
    const msgDate = new Date(date);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isSameDay = (d1, d2) => d1.toDateString() === d2.toDateString();

    if (isSameDay(msgDate, today)) return "Today";
    if (isSameDay(msgDate, yesterday)) return "Yesterday";

    return msgDate.toLocaleDateString([], {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Ensure socket connection (handshake auth token is set in connectSocket)
  useEffect(() => {
    connectSocket();
  }, []);

  // Rejoin on reconnect
  useEffect(() => {
    const onConnect = () => {
      if (teamId) socket.emit("join_team", { teamId });
    };

    socket.on("connect", onConnect);
    return () => {
      socket.off("connect", onConnect);
    };
  }, [teamId]);

  // Team room lifecycle + history + realtime
  useEffect(() => {
    if (!teamId) return;

    if (prevTeamRef.current && prevTeamRef.current !== teamId) {
      socket.emit("leave_team", { teamId: prevTeamRef.current });
    }

    socket.emit("join_team", { teamId });
    prevTeamRef.current = teamId;

    const handleReceiveMessage = (msg) => {
      setMessages((prev) => mergeMessagesById(prev, [msg]));

      if (!isNearBottom()) {
        setHasNewMessage(true);
      } else {
        emitSeen();
      }
    };

    socket.on("receive_message", handleReceiveMessage);

    let mounted = true;

    (async () => {
      try {
        const res = await api.get(`/api/messages/${teamId}`);
        if (!mounted) return;

        setMessages((prev) => mergeMessagesById(prev, res.data || []));

        setTimeout(() => {
          if (!mounted) return;
          scrollToBottom(false);
          setInitialLoaded(true);
          socket.emit("mark_seen", { teamId });
        }, 100);
      } catch (err) {
        console.error(err);
      }
    })();

    return () => {
      mounted = false;
      clearTimeout(seenTimeoutRef.current);
      socket.emit("leave_team", { teamId });
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [teamId]);

  // Auto-scroll on new messages if user already near bottom
  useEffect(() => {
    if (!initialLoaded) return;
    if (isNearBottom()) {
      scrollToBottom(true);
    }
  }, [messages, initialLoaded]);

  const sendMessage = () => {
    const clean = text.trim();
    if (!clean || !teamId) return;

    const clientMsgId = crypto.randomUUID();

    socket.timeout(5000).emit(
      "send_message",
      { teamId, text: clean, clientMsgId },
      (err, ack) => {
        if (err || !ack?.ok) {
          console.error("send_message failed", err || ack);
          return;
        }
      },
    );

    setText("");
    emitSeen();
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Layout>
      <div className="p-6 max-w-2xl mx-auto bg-white rounded-xl shadow flex flex-col h-[80vh] relative">
        <h2 className="text-xl font-bold mb-3">{teamName || "Loading..."}</h2>

        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto space-y-2 p-3 bg-gray-50 rounded border"
        >
          {messages.length === 0 && (
            <p className="text-gray-400 text-center mt-10">No messages yet...</p>
          )}

          {messages.map((msg, index) => {
            const isMine = msg.senderId === currentUserId;
            const currentDate = new Date(msg.createdAt).toDateString();
            const prevDate =
              index > 0
                ? new Date(messages[index - 1].createdAt).toDateString()
                : null;

            const showDateSeparator = currentDate !== prevDate;

            return (
              <div key={msg._id || index}>
                {showDateSeparator && (
                  <div className="flex items-center my-4">
                    <div className="flex-1 h-px bg-gray-300" />
                    <span className="px-3 text-xs text-gray-500">
                      {getDateLabel(msg.createdAt)}
                    </span>
                    <div className="flex-1 h-px bg-gray-300" />
                  </div>
                )}

                <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                  <div className="max-w-[70%]">
                    {!isMine && (
                      <p className="text-xs text-gray-500 mb-1 ml-1">
                        {msg.senderName}
                      </p>
                    )}

                    <div
                      className={`px-3 py-2 rounded-lg shadow ${
                        isMine
                          ? "bg-[#9AC0CD] text-white rounded-br-none"
                          : "bg-gray-200 text-gray-800 rounded-bl-none"
                      }`}
                    >
                      <div className="flex items-end gap-2">
                        <p className="text-sm break-words flex-1">{msg.text}</p>
                        <span className="text-[10px] opacity-60">
                          {formatTime(msg.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          <div ref={bottomRef} />
        </div>

        {hasNewMessage && (
          <button
            onClick={() => {
              scrollToBottom();
              setHasNewMessage(false);
              emitSeen();
            }}
            className="absolute bottom-24 right-6 bg-[#4A90A4] text-white px-3 py-1.5 rounded-full shadow-md hover:bg-[#3B7C8A] transition"
          >
            New messages ↓
          </button>
        )}

        <div className="flex gap-2 mt-3">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#9AC0CD]"
          />
          <button
            onClick={sendMessage}
            className="bg-[#9AC0CD] text-white px-4 py-2 rounded hover:bg-[#7AA0A7]"
          >
            Send
          </button>
        </div>
      </div>
    </Layout>
  );
}

export default Chat;