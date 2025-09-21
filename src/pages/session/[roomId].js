import { useRouter } from 'next/router';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useSession } from "next-auth/react";
import { io } from 'socket.io-client';

// Import all necessary components
import ControlBar from '../../components/ControlBar';
import RequestNotification from '../../components/RequestNotification';
import ShoppingPage, { products } from '../../components/ShoppingPage'; // Import products here
import SharedCart from '../../components/SharedCart';
import ChatWindow from '../../components/ChatWindow';
import LiveReactionsOverlay from '../../components/LiveReactionsOverlay';
import ReactionButtons from '../../components/ReactionButtons';
import AiSalesmanChat from '../../components/AiSalesmanChat'; // Import the new AI component

const socket = io('https://squad-shop-backend.onrender.com');

export default function SessionPage() {
    const router = useRouter();
    const { roomId } = router.query;
    const { data: session, status } = useSession({ required: true });

    // State for all features
    const [controllerId, setControllerId] = useState('');
    const [requestorId, setRequestorId] = useState(null);
    const [cartItems, setCartItems] = useState([]);

    const shoppingPageRef = useRef(null);
    const myId = session?.user?.email;
    const isController = myId === controllerId;

    // Fetch the shared cart from the database
    const fetchCart = useCallback(async () => {
        if (!roomId) return;
        try {
            const response = await fetch(`/api/cart?roomId=${roomId}`);
            if (response.ok) {
                const data = await response.json();
                setCartItems(data.cartItems);
            }
        } catch (error) {
            console.error("Failed to fetch cart:", error);
        }
    }, [roomId]);

    // Effect to manage socket connections and listeners
    useEffect(() => {
        if (status === "loading" || !router.isReady || !myId) return;

        socket.connect();
        socket.emit('join_room', { roomId, userId: myId });
        fetchCart();

        // Listen for events from the server
        socket.on('joined_room', ({ controllerId }) => setControllerId(controllerId));
        socket.on('controller_changed', ({ newControllerId }) => setControllerId(newControllerId));
        socket.on('new_control_request', ({ requestingUserId }) => setRequestorId(requestingUserId));
        socket.on('new_cart_activity', fetchCart);

        return () => { // Cleanup on component unmount
            socket.off('joined_room');
            socket.off('controller_changed');
            socket.off('new_control_request');
            socket.off('new_cart_activity');
            socket.disconnect();
        };
    }, [router.isReady, roomId, myId, status, fetchCart]);

    // Handler to add an item to the cart
    const handleAddToCart = async (product) => {
        if (!myId) return;
        const newItem = { ...product, addedBy: myId };

        // Optimistically update UI
        setCartItems(prevItems => [...prevItems, newItem]);

        // Send update to the backend
        await fetch(`/api/cart?roomId=${roomId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product),
        });
        
        // Notify others in the room
        socket.emit('cart_updated');
    };
    
    // Other handlers for your features
    const handleRequestControl = () => socket.emit('request_control');
    const handleGrantControl = (newControllerId) => socket.emit('grant_control', { newControllerId });
    const handleDenyControl = () => setRequestorId(null);
    const handleScroll = (event) => {
        if (isController) {
            socket.emit('sync_scroll', { scrollPosition: event.target.scrollTop });
        }
    };
    const handleSelectReaction = (reaction) => socket.emit('send_reaction', { reaction });

    if (status === "loading") {
        return <p>Loading session...</p>;
    }

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
            <h1>Shopping Session: {roomId}</h1>
            <p>Welcome, <strong>{session.user.name}</strong></p>

            {/* Render all your components */}
            <ControlBar isController={isController} controllerId={controllerId} onRequestControl={handleRequestControl} />
            <RequestNotification requestorId={requestorId} onAccept={handleGrantControl} onDeny={handleDenyControl} />
            <SharedCart items={cartItems} />
            <AiSalesmanChat products={products} />
            <ShoppingPage ref={shoppingPageRef} onScroll={handleScroll} onAddToCart={handleAddToCart} />
            <ChatWindow socket={socket} userId={myId} />
            <LiveReactionsOverlay socket={socket} />
            <ReactionButtons onSelectReaction={handleSelectReaction} />
        </div>
    );
}