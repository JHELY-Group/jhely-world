import Arena from "@colyseus/arena";
import { monitor } from "@colyseus/monitor";
import express from 'express';
import cors from 'cors';

/**
 * Import your Room files
 */
import { MainSpaceRoom } from "./rooms/MainSpaceRoom";

export default Arena({
    getId: () => "Your Colyseus App",

    initializeGameServer: (gameServer) => {
        /**
         * Define your room handlers:
         */
        gameServer.define('main_space', MainSpaceRoom);

    },

    initializeExpress: (app) => {
        app.use(cors());
        app.use(express.json());
        /**
         * Bind your custom express routes here:
         */
        app.get("/", (req, res) => {
            res.send("It's time to kick ass and chew bubblegum!");
        });

        /**
         * Bind @colyseus/monitor
         * It is recommended to protect this route with a password.
         * Read more: https://docs.colyseus.io/tools/monitor/
         */
        app.use("/colyseus", monitor());
    },


    beforeListen: () => {
        /**
         * Before before gameServer.listen() is called.
         */
    }
});