import {useAccount, useCoState} from "@/2_main";
import {useNavigate, useParams} from "react-router";
import {Button} from "@/components/ui/button.tsx";
import {Pencil} from 'lucide-react';
import {Playlist} from "@/1_schema.ts";
import {ID} from "jazz-tools";
import {useState} from "react";
import {updatePlaylistTitle} from "@/4_actions.ts";

export function SidePanel() {
    const {playlistId} = useParams();
    const navigate = useNavigate();
    const {me} = useAccount({
        root: {
            playlists: [{}],
        },
    });

    function handleAllTracksClick(
        evt: React.MouseEvent<HTMLAnchorElement>,
    ) {
        evt.preventDefault();
        navigate(`/`);
    }

    function handlePlaylistClick(
        playlistId: string,
    ) {
        navigate(`/playlist/${playlistId}`);
    }


    function onRenameClick(playlistId: string, name: string) {
        const playlist = me?.root.playlists.find((p) => p.id === playlistId);

        if (!playlist) return;

        updatePlaylistTitle(playlist, name)

    }

    return (
        <aside className="w-64 p-6 bg-white overflow-y-auto">
            <div className="flex items-center mb-6">
                <svg
                    className="w-8 h-8 mr-2"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M9 18V5l12-2v13"
                        stroke="#3b82f6"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M6 15H3c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h3c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2zM18 13h-3c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h3c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2z"
                        fill="#3b82f6"
                    />
                </svg>
                <span className="text-xl font-bold text-blue-600">
                    Music Player
                </span>
            </div>
            <nav>
                <h2 className="mb-2 text-sm font-semibold text-gray-600">
                    Playlists
                </h2>
                <ul className="space-y-1">
                    <li>
                        <a
                            href="#"
                            className={`block px-2 py-1 text-sm rounded ${
                                !playlistId
                                    ? "bg-blue-100 text-blue-600"
                                    : "hover:bg-blue-100"
                            }`}
                            onClick={handleAllTracksClick}
                        >
                            All tracks
                        </a>
                    </li>
                    {me?.root.playlists.map((playlist, index) => (
                        <li key={index} className={`relative`}>
                            <PlayListItem playlistId={playlist.id} onClick={handlePlaylistClick}
                                          onRenameClick={onRenameClick} isSelected={playlist.id === playlistId}/>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
}

function PlayListItem(props: {
    playlistId: ID<Playlist>,
    onClick: (playlistId: string) => void,
    onRenameClick: (playlistId: string, name: string) => void,
    isSelected: boolean
}) {

    const playlist = useCoState(Playlist, props.playlistId);

    const [isEditing, setIsEditing] = useState(false);

    if (!playlist) return null;

    return <>
        {
            !isEditing && <a
                href="#"
                className={`block px-2 py-1 text-sm rounded ${
                    props.isSelected
                        ? "bg-blue-100 text-blue-600"
                        : "hover:bg-blue-100"
                }`}
                onClick={(evt) => {
                    evt.preventDefault()
                    props.onClick(props.playlistId);
                }}
            >
                {playlist.title}
            </a>
        }
        {
            isEditing && <form onSubmit={(evt) => {
                evt.preventDefault()
                setIsEditing(false)
            }}>
                <input
                    type={`text`}
                    autoFocus={true}
                    value={playlist.title}
                    onChange={(evt) => {
                        if (!playlist) return;

                        updatePlaylistTitle(playlist, evt.target.value)
                    }}
                    onBlur={() => setIsEditing(false)}
                    className="text-blue-800 bg-transparent"/>
            </form>
        }
        <button className={`border absolute right-0 top-0`} onClick={(evt) => {
            evt.preventDefault()
            setIsEditing(!isEditing)
        }}>
            <Pencil/>
        </button>
    </>
}