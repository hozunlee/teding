import { useState } from "react";
import { getKSTDateStr } from "../_lib/date";
import { useAdminVideos } from "../_hooks/useAdminVideos";
import { useYouTubePlayer } from "../_hooks/useYouTubePlayer";
import { VideoStatusCard } from "./VideoStatusCard";
import { VideoEditForm } from "./VideoEditForm";

export function AdminVideoTab() {
    const {
        today,
        tomorrow,
        todayHasVideo,
        tomorrowHasVideo,
        editMode,
        setEditMode,
        targetDate,
        setTargetDate,
        submitting,
        result,
        setResult,
        handleSubmit,
        handleReset,
    } = useAdminVideos();

    const [videoInput, setVideoInput] = useState("");
    const [force, setForce] = useState(false);

    const { title, duration, setTitle, setDuration } = useYouTubePlayer(videoInput);

    const showForm = editMode !== null || !todayHasVideo || !tomorrowHasVideo;

    const cancelEdit = () => {
        setEditMode(null);
        setVideoInput("");
        setTitle("");
        setDuration("");
        setResult(null);
    };

    const clearForm = () => {
        setVideoInput("");
        setTitle("");
        setDuration("");
    };

    return (
        <>
            <VideoStatusCard
                title="오늘"
                dateStr={getKSTDateStr(0)}
                data={today}
                onEdit={() => {
                    setEditMode("today");
                    setTargetDate("today");
                    setResult(null);
                }}
            />

            <div className="mb-6">
                <VideoStatusCard
                    title="내일"
                    dateStr={getKSTDateStr(1)}
                    data={tomorrow}
                    onEdit={() => {
                        setEditMode("tomorrow");
                        setTargetDate("tomorrow");
                        setResult(null);
                    }}
                />
            </div>

            {showForm && (
                <VideoEditForm
                    editMode={editMode}
                    targetDate={targetDate}
                    todayHasVideo={todayHasVideo}
                    videoInput={videoInput}
                    title={title}
                    duration={duration}
                    force={force}
                    submitting={submitting}
                    result={result}
                    setTargetDate={setTargetDate}
                    setVideoInput={setVideoInput}
                    setTitle={setTitle}
                    setDuration={setDuration}
                    setForce={setForce}
                    cancelEdit={cancelEdit}
                    onSubmit={(e) =>
                        handleSubmit(
                            e,
                            { videoInput, title, duration, force },
                            clearForm
                        )
                    }
                    onReset={() => handleReset(videoInput, clearForm)}
                />
            )}
        </>
    );
}
