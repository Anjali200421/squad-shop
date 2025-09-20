// pages/session/[roomId].js
import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import ControlBar from '../../components/ControlBar';
import RequestNotification from '../../components/RequestNotification';
import ShoppingPage from '../../components/ShoppingPage';
import ChatWindow from '../../components/ChatWindow';
import ReactionButtons from '../../components/ReactionButtons';
import LiveReactionsOverlay from '../../components/LiveReactionsOverlay';

const socket = io('http://localhost:3001', {
    autoConnect: false
});

export default function SessionPage() {
    const router = useRouter();
    const { roomId } = router.query;
    const shoppingPageRef = useRef(null);

    const [myId, setMyId] = useState('');
    const [controllerId, setControllerId] = useState('');
    const [requestorId, setRequestorId] = useState(null);

    const isController = myId === controllerId;

    useEffect(() => {
        if (!router.isReady) return;

        const currentUserId = localStorage.getItem('userId') || user_${Math.random().toString(36).substring(2, 9)};
        localStorage.setItem('userId', currentUserId);
        setMyId(currentUserId);

        socket.connect();
        socket.emit('join_room', { roomId, userId: currentUserId });

        socket.on('joined_room', ({ controllerId, scrollPosition }) => {
            setControllerId(controllerId);
            if (shoppingPageRef.current) {
                shoppingPageRef.current.scrollTop = scrollPosition;
            }
        });

        socket.on('scroll_update', ({ scrollPosition }) => {
            const amIController = localStorage.getItem('userId') === controllerIdRef.current;
            if (shoppingPageRef.current && !amIController) {
                shoppingPageRef.current.scrollTop = scrollPosition;
            }
        });
        
        socket.on('new_control_request', ({ requestingUserId }) => {
            setRequestorId(requestingUserId);
        });

        socket.on('controller_changed', ({ newControllerId }) => {
            setControllerId(newControllerId);
            setRequestorId(null);
        });

        return () => {
            console.log("Disconnecting socket...");
            socket.disconnect();
        };
    }, [router.isReady, roomId]);

    const controllerIdRef = useRef(controllerId);
    useEffect(() => {
        controllerIdRef.current = controllerId;
    }, [controllerId]);

    const handleRequestControl = () => socket.emit('request_control');
    const handleGrantControl = (newControllerId) => socket.emit('grant_control', { newControllerId });
    const handleDenyControl = () => setRequestorId(null);
    const handleScroll = (event) => socket.emit('sync_scroll', { scrollPosition: event.target.scrollTop });
    
    const handleSelectReaction = (reaction) => {
        socket.emit('send_reaction', { reaction });
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
            <h1>Shopping Session: {roomId}</h1>
            <p>My User ID: <strong>{myId}</strong></p>

            <ControlBar
                isController={isController}
                controllerId={controllerId}
                onRequestControl={handleRequestControl}
            />
            <RequestNotification
                requestorId={requestorId}
                onAccept={handleGrantControl}
                onDeny={handleDenyControl}
            />
            <ShoppingPage
                ref={shoppingPageRef}
                onScroll={isController ? handleScroll : null}
            />
            <ChatWindow socket={socket} userId={myId} />

            <LiveReactionsOverlay socket={socket} />
            <ReactionButtons onSelectReaction={handleSelectReaction} />
        </div>
    );
}