import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../AuthContext/AuthContextProvider'
// import TypingField from '../TypingField/TypingField.Page'
import { SearchIcon, CheckIcon, ArrowLeftIcon } from '@heroicons/react/solid'
import { addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, query, setDoc, updateDoc, where } from 'firebase/firestore'
import { db } from '../../firebase'
// import { uuid } from '../../utils/utils'
import { UserIcon } from "@heroicons/react/solid"
import TypingTestMultiplayer from './TypingTestMultiplayer'
import { Fetch_Words } from '../TypingFieldSinglePlayer/Queries'
import { Fetch_Words_Limit } from './Queries'
type RoomData = {
    isSet: boolean,
    initializer: string,
    players?: any,
    isStart: boolean,
    scores?: any,
    words: string,
    winner: number[]
}
const initialRoomData = {
    isSet: false,
    initializer: "",
    isStart: false,
    players: [],
    words: "[]",
    winner: []
}


function TypingFieldMultiplayer() {
    const { AuthState } = useContext(AuthContext)
    const { data: words, isLoading, isFetching, refetch } = Fetch_Words_Limit(50)
    const colRef = collection(db, "rooms")
    const [searchPlayer, setSetSearchPlayer] = useState<boolean>(false)
    const [playerIndex, setPlayerIndex] = useState<number>(0)
    const [roomId, setRoomId] = useState<string>("")
    const [roomData, setRoomData] = useState<RoomData>(initialRoomData)

    const [counter, setCounter] = useState(5);
    let unsubscribe = () => { };
    // const [testId, setRoomId] = useState<string>(uuid())








    const listenToRoom = (id: string) => {
        setRoomId(id)
        unsubscribe = onSnapshot(
            doc(db, "rooms", id),
            { includeMetadataChanges: true },
            (doc) => {
                if (doc.data()) setRoomData(doc.data() as RoomData)
                else setRoomData(initialRoomData)
                // console.log(doc.data())
            }
        );
    }

    const SearchPlayerHandler = async () => {
        setSetSearchPlayer(true)
        const q = query(colRef, where("isSet", "==", false));
        const docs = await getDocs(q);
        const documentData = docs.docs[Math.floor(Math.random() * docs.docs.length)]
        if (docs.docs.length === 0) {
            const data = {
                isSet: false,
                initializer: AuthState.userData.username,
                players: [
                    {
                        username: AuthState.userData.username,
                        isReady: false,
                        wordIndex: 0
                    }
                ],
                isStart: false,
                words: JSON.stringify(words),
                winner: []
            }
            console.log(data)
            const res = await addDoc(colRef, data);
            setPlayerIndex(0)
            listenToRoom(res.id)

        } else {
            // if(documentData.data().initializer === AuthState.userData.username){
            //     listenToRoom(documentData.id)
            //     setPlayerIndex(0)
            //     await updateDoc(doc(db, "rooms", documentData.id), {
            //         "isSet": documentData.data().players,
            //     })
            // }
            listenToRoom(documentData.id)
            setPlayerIndex(1)
            await updateDoc(doc(db, "rooms", documentData.id), {
                "isSet": true,
                "players": [
                    ...documentData.data().players,
                    {
                        username: AuthState.userData.username,
                        isReady: false,
                        wordIndex: 0,
                        finish: false,
                        speed: 0
                    }
                ]
            })
            // setRoomData( as RoomData)

        }
    }

    const leaveRoom = async () => {
        setSetSearchPlayer(false)
        let players = roomData.players.filter((el: any) => {
            return el.username !== AuthState.userData.username
        })
        players[0].isReady = false
        if (roomData.winner.length !== 2) {
            await updateDoc(doc(db, "rooms", roomId), {
                "initializer": players[0].username,
                "isSet": false,
                "players": players
            })
        }
        setRoomData(initialRoomData)
    }

    const cancelSearchPlayerHandler = async () => {
        setSetSearchPlayer(false)
        unsubscribe()
        if (roomData.initializer === AuthState.userData.username) {
            console.log("delete room")
            await deleteDoc(doc(db, "rooms", roomId))
            refetch()
        }
        setRoomData(initialRoomData)
    }

    const toggleReadyButton = async () => {
        let newPlayersStatus = roomData.players
        newPlayersStatus[playerIndex].isReady = !roomData.players[playerIndex].isReady
        if (newPlayersStatus[playerIndex].isReady === false) setCounter(10)
        await updateDoc(doc(db, "rooms", roomId), {
            "players": newPlayersStatus

        })
    }


    useEffect(() => {
        let timer: number = 0
        if (roomData.players[0]?.isReady && roomData.players[1]?.isReady && counter >= -1) {
            timer = window.setInterval(() => {
                if (counter >= 0) setCounter(counter - 1)
            }, 1000);
        } else {
            setCounter(10)
            clearInterval(timer)
        }
        return () => {

            clearInterval(timer)
        };
    }, [counter, roomData.players]);

    useEffect(() => {

        if (roomData.isSet) {
            window.onbeforeunload = function () {
                return true;
            };
        }
        if (roomData.players.length === 1) {
            window.onbeforeunload = (event) => {
                // Cancel the event as stated by the standard.
                event.preventDefault();
                // Chrome requires returnValue to be set.
                event.returnValue = 'yakin meninggalkan ruang';
            };
        }

        return () => {
            window.onbeforeunload = null;
        };
    }, [roomData.isSet, roomData.players]);



    const props = {
        playerIndex,
        players: roomData.players,
        words: JSON.parse(roomData.words),
        roomId,
        winner: roomData.winner,
        leaveRoom
    }


    if (!AuthState.isLoggedIn) return (
        <div className="center h-screen text-white flex-col">
            <div>You're not Logged In</div>
            <div>Please Logged in to use this features</div>
        </div>)


    return (

        <div className={`text-white h-screen center flex-col dark:bg-dark-blue-gradient  gap-2`}>
            {
                ((roomData.players[0]?.isReady && roomData.players[1]?.isReady && counter < 0)) ?
                    // true ?
                    <TypingTestMultiplayer
                        {...props}
                    /> :
                    <>
                        <h1 className='text-3xl mb-10 font-bold text-gray-900  dark:text-white'>Multiplayer Mode</h1>
                        <div className='w-full center'>
                            <div className='relative center flex-col gap-5 border h-[400px] w-[350px] rounded-lg border-gray-200 dark:border-gray-900'>
                                {
                                    roomData.isSet &&
                                    <button onClick={leaveRoom} className="absolute top-0  left-0 center h-10 w-10">
                                        <ArrowLeftIcon className='h-5 w-5 text-blue-500' />
                                    </button>
                                }
                                {
                                    roomData.players[playerIndex]?.isReady &&
                                    <div className="absolute top-0 right-0 center h-10 w-10">
                                        <CheckIcon className='text-blue-500' />
                                    </div>
                                }

                                <div className="h-40 w-40 center rounded-full border border-blue-900 p-3">
                                    <UserIcon className='h-full w-full rounded-lg text-gray-500 border border-blue-900' />
                                </div>
                                <h2 className='text-2xl text-gray-900 dark:text-white '>{AuthState.userData.username}</h2>

                                {
                                    !searchPlayer ?
                                        <button onClick={SearchPlayerHandler} className='px-5 py-2.5 text-xl font-bold rounded-lg  shadow-lg bg-blue-500 hover:bg-blue-600 transition duration-300 tracking-widest '>
                                            START
                                        </button> :
                                        <div className='flex gap-5'>
                                            <button onClick={toggleReadyButton} disabled={(searchPlayer && !roomData.isSet) && true} className={`px-5 py-2.5 text-xl font-bold rounded-lg  shadow-lg ${(searchPlayer && !roomData.isSet) ? 'bg-blue-900 text-gray-600 hover:cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}  transition duration-300 tracking-widest `}>
                                                {roomData.players[playerIndex]?.isReady ? 'CANCEL' : 'READY'}
                                            </button>
                                        </div>
                                }
                            </div>


                            <div className={`relative center flex-col gap-5 border border-gray-200 dark:border-gray-900 h-[400px] w-[350px] p-10 ml-10 ${(!searchPlayer) && 'translate-y-10 opacity-0 w-[0px] p-0 ml-0'}  overflow-hidden transition-all duration-300 rounded-lg border-gray-900`}>

                                {

                                    roomData.isSet ?
                                        roomData.players.map((p: any, i: number) => {
                                            if (p.username != AuthState.userData.username) {
                                                return (
                                                    <>
                                                        {
                                                            p.isReady &&
                                                            <div className="absolute top-0 right-0 center h-10 w-10">
                                                                <CheckIcon className='text-blue-500' />
                                                            </div>
                                                        }
                                                        <div key={i} className="center flex-col gap-5">
                                                            <div className="h-40 w-40 center rounded-full border border-blue-900 p-3">
                                                                <UserIcon className='h-full w-full rounded-lg text-gray-500 border border-blue-900' />
                                                            </div>
                                                            <h2 className='text-2xl text-gray-900 dark:text-white '>{p.username}</h2>
                                                            {!p.isReady && <p className='animate-pulse py-2.5 '>Please Wait...</p>}
                                                        </div>
                                                    </>
                                                )
                                            }
                                        })
                                        :
                                        <>
                                            <div className="text-center center">
                                                <SearchIcon className='h-32 w-32 animate-pulse font-bold text-gray-500 dark:text-white' />
                                            </div>
                                            <h1 className='text-xl font-bold text-gray-500 dark:text-white'>Searching for player</h1>
                                            <button onClick={cancelSearchPlayerHandler} className='px-5 py-2.5 text-xl font-bold rounded-lg  shadow-lg bg-red-500 hover:bg-red-600 transition duration-300 tracking-widest '>
                                                CANCEL
                                            </button>
                                        </>
                                }
                            </div>
                        </div>
                        <div className='h-10 center text-xl text-gray-500 dark:text-white'>
                            {(roomData.players[0]?.isReady && roomData.players[1]?.isReady) && `Match Starts in ${counter}`}
                        </div>
                    </>
            }
        </div>

    )
}

export default TypingFieldMultiplayer

