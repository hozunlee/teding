"use client";

import { useEffect, useRef, useState } from "react";
import { parseVideoId, formatDuration, YTPlayer, YTPlayerEvent } from "../_lib/youtube";

export function useYouTubePlayer(videoInput: string) {
    const [title, setTitle] = useState("");
    const [duration, setDuration] = useState("");
    const playerRef = useRef<YTPlayer | null>(null);

    useEffect(() => {
        const videoId = parseVideoId(videoInput);
        if (videoId.length !== 11) {
            setTitle("");
            setDuration("");
            return;
        }

        fetch(
            `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
        )
            .then((r) => (r.ok ? r.json() : null))
            .then((data: { title?: string } | null) => {
                if (data?.title) setTitle(data.title);
            })
            .catch(() => {});

        const createPlayer = () => {
            if (playerRef.current) {
                playerRef.current.destroy();
                playerRef.current = null;
            }
            const div = document.createElement("div");
            div.id = "yt-hidden-player";
            div.style.display = "none";
            document.body.appendChild(div);

            playerRef.current = new window.YT.Player("yt-hidden-player", {
                videoId,
                events: {
                    onReady: (e: YTPlayerEvent) => {
                        const secs = e.target.getDuration();
                        if (secs > 0) setDuration(formatDuration(secs));
                        e.target.destroy();
                        playerRef.current = null;
                        div.remove();
                    },
                },
            });
        };

        if (window.YT?.Player) {
            createPlayer();
        } else {
            window.onYouTubeIframeAPIReady = createPlayer;
            if (!document.getElementById("yt-iframe-api")) {
                const script = document.createElement("script");
                script.id = "yt-iframe-api";
                script.src = "https://www.youtube.com/iframe_api";
                document.head.appendChild(script);
            }
        }

        return () => {
            if (playerRef.current) {
                playerRef.current.destroy();
                playerRef.current = null;
            }
            document.getElementById("yt-hidden-player")?.remove();
        };
    }, [videoInput]);

    return { title, duration, setTitle, setDuration };
}
