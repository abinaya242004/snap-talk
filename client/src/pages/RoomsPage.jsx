import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { motion } from "framer-motion";
import { FiMessageCircle, FiPlus } from "react-icons/fi";
import { setRooms } from "../redux/slices/chatSlice";
import Sidebar from "../components/Sidebar";
import AppNavigation from "../components/AppNavigation";
import Header from "../components/Header";
import EmptyState from "../components/EmptyState";
import Button from "../components/Button";
import Modal from "../components/Modal";
import Input from "../components/Input";
import Loader from "../components/Loader";

const RoomsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { rooms } = useSelector((state) => state.chat);

  const [roomName, setRoomName] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setErrorLocal] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchRooms = async () => {
    try {
      const response = await axios.get(
        "https://snap-talk-3-bl2l.onrender.com/api/chatrooms",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      dispatch(setRooms(response.data));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    fetchRooms();
  }, [token, navigate]);

  const createRoom = async (e) => {
    e.preventDefault();
    if (!roomName.trim()) {
      setErrorLocal("Room name cannot be empty");
      return;
    }

    setCreating(true);
    setErrorLocal("");

    try {
      await axios.post(
        "https://snap-talk-3-bl2l.onrender.com/api/chatrooms",
        { name: roomName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setRoomName("");
      setShowCreateModal(false);
      fetchRooms();
    } catch (error) {
      setErrorLocal(error.response?.data?.message || "Failed to create room");
    } finally {
      setCreating(false);
    }
  };

  const handleJoinRoom = (roomId) => {
    navigate(`/chat/${roomId}`);
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-main)]">
      {/* App Navigation */}
      <AppNavigation />

      {/* Sidebar */}
      <Sidebar rooms={rooms} onJoinRoom={handleJoinRoom} activeRoomId={null} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative min-w-0">
        <Header
          roomName=""
          onlineUsersCount={0}
          roomAvatar={null}
          isGroup={false}
          isOnline={false}
        />

        <div className="flex-1 overflow-hidden">
          <EmptyState
            icon={FiMessageCircle}
            title="Welcome to Snap Talk"
            description="Select a room from the sidebar to start chatting, or create a new one to gather your friends."
            action={
              <Button
                onClick={() => setShowCreateModal(true)}
                icon={FiPlus}
                size="lg"
              >
                Create New Room
              </Button>
            }
          />
        </div>
      </div>

      {/* Create Room Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setErrorLocal("");
          setRoomName("");
        }}
        title="Create a New Room"
      >
        <form onSubmit={createRoom} className="space-y-4">
          <p className="text-[var(--text-muted)] text-sm mb-4">
            Give your new room a personality with a name. You can always change
            it later.
          </p>

          <Input
            label="Room Name"
            placeholder="e.g. 'Weekend Plans' or 'General Chat'"
            value={roomName}
            onChange={(e) => {
              setRoomName(e.target.value);
              setErrorLocal("");
            }}
            error={error}
            autoFocus
            required
          />

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setShowCreateModal(false);
                setErrorLocal("");
                setRoomName("");
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={creating || !roomName.trim()}>
              {creating ? "Creating..." : "Create Room"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default RoomsPage;
