module.exports = (io) => {
    io.on("connection", (socket) => {
        // console.log("User connected:", socket.id);

        // Join room
        socket.on("join_admin_room", () => {
            socket.join("admin_room");
        });

        socket.on("join_view_order_status", () => {
            socket.join("join_view_order_status");
            console.log("User join view order status: ", socket.id);
            
        });

        socket.on("join_view_table_status", () => {
            socket.join("join_view_table_status");
            console.log("User join view table status: ", socket.id);
        });

        // Listen events
        socket.on("new_order", (data) => {
            io.to("join_view_order_status").emit("new_order", data);
        });

        socket.on("update_order_status", (data) => {
            io.to("join_view_order_status").emit("update_order_status", data);
        });

        socket.on("update_table_status", (data) => {
            io.to("join_view_table_status").emit("update_table_status", data);
            console.log("Sent to order_status view room: ", socket.id);
        });

        socket.on("disconnect", () => {
            // console.log("User disconnected:", socket.id);
        });
    });
};