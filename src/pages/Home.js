import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    CustomButton,
    EditProfile,
    FriendsCard,
    Loading,
    PostCard,
    ProfileCard,
    TextInput,
    TopBar,
} from "../components";
import { Link } from "react-router-dom";
import { NoProfile } from "../assets";
import { BsFiletypeGif, BsPersonFillAdd } from "react-icons/bs";
import { BiImages, BiSolidVideo } from "react-icons/bi";
import { useForm } from "react-hook-form";
import { apiRequest, deletePost, fetchPost, likePost, sendFriendRequest } from "../utils";
import { UserLogin } from "../redux/userSlice";

const Home = () => {
    const { posts } = useSelector((state) => state.posts);
    const { user, edit } = useSelector((state) => state.user);
    const [friendRequest, setFriendRequest] = useState([]);
    const [suggestedFriends, setSuggestedFriends] = useState([]);
    const [errMsg, setErrMsg] = useState("");
    const [file, setFile] = useState(null);
    const [posting, setPosting] = useState(false);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const handlePostSubmit = async (data) => {
        setPosting(true);
        setErrMsg("");
        try {
            const response = await apiRequest({
                url: "/posts/create-post",
                method: "POST",
                data: data,
                token: user?.token
            });
            
            if (response?.status === "failed") {
                setErrMsg(response);
            }
            else {
                reset({
                    description: "",
                });
                setFile(null);
                setErrMsg("");
                await handleFetchPosts();
            }
            setPosting(false);
        } catch (error) {
            setFile(null);
            setErrMsg(error);
            setPosting(false);
        }
     };
    const getUser = async () => { 
        try {
            const res = await apiRequest({
                url: "/users/get-user",
                method: "GET",
                token: user?.token
            });
            const newData = {
                        token: res?.token,
                        ...res?.user
                    };

                dispatch(UserLogin(newData));
        } catch (error) {
            console.log(error);
        }
    };
    const handleFetchPosts = async () => {
        await fetchPost(user?.token, dispatch)
        setLoading(false)
     };

     const handleLikePost = async (uri) => {
             await likePost({uri: uri, token: user?.token});

            await handleFetchPosts();
          };
    
    const fetchSuggestedFriends = async () => {
        try {
            const res = await apiRequest({
                url: "/users/suggested-friends",
                method: "POST",
                token: user?.token
            });
            setSuggestedFriends(res?.data);
        } catch (error) {
            console.log(error);
        }
     };
    const handleDeletePost = async (id) => {
        await deletePost(id, user?.token);

        await handleFetchPosts();
    }

    const handleFriendRequest = async (id) => {
        try {
            await sendFriendRequest(user?.token, id);
            await fetchSuggestedFriends();
        } catch (error) {
            console.log(error);
        }
    }

    const acceptFriendRequest = async (id, status) => {
        try {
            const res = await apiRequest({
                url: "/users/accept-friend-request",
                method: "POST",
                data: { rid: id, status },
                token: user?.token
            })
            await fetchFriendRequests();
            await fetchSuggestedFriends();
            getUser()
            setFriendRequest(res?.data)
        } catch (error) {
            console.log(error);
        }
    }

    const fetchFriendRequests = async () => {
        try {
            const res = await apiRequest({
                url: "/users/get-friend-request",
                method: "POST",
                token: user?.token
            });
            setFriendRequest(res?.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        setLoading(true);
        handleFetchPosts();
        // fetchFriendRequests();
        fetchSuggestedFriends();
    }, []);

    return (
        <>
            <div className='w-full px-0 lg:px-10 pb-20 2xl:px-40 bg-bgColor lg:rounded-lg h-screen overflow-hidden'>
                <TopBar />

                <div className='w-full flex gap-2 lg:gap-4 pt-5 pb-10 h-full'>
                    {/* LEFT */}
                    <div className='hidden w-1/3 lg:w-1/4 h-full md:flex flex-col gap-6 overflow-y-auto'>
                        <ProfileCard user={user} />
                        <FriendsCard friends={user?.friends} />
                    </div>

                    {/* CENTER */}
                    <div className='flex-1 h-full px-4 flex flex-col gap-6 overflow-y-auto rounded-lg'>
                        <form
                            onSubmit={handleSubmit(handlePostSubmit)}
                            className='bg-primary px-4 rounded-lg'
                        >
                            <div className='w-full flex items-center gap-2 py-4 border-b border-[#66666645]'>
                                <img
                                    src={user?.profileUrl ?? NoProfile}
                                    alt={user.profile}
                                    className='w-14 h-14 rounded-full object-cover'
                                />
                                <TextInput
                                    styles='w-full rounded-full py-5'
                                    placeholder="What's on your mind...."
                                    name='description'
                                    register={register("description", {
                                        required: "Write something about post",
                                    })}
                                    error={errors.description ? errors.description.message : ""}
                                />
                            </div>
                            {errMsg?.message && (
                                <span
                                    role='alert'
                                    className={`text-sm ${errMsg?.status === "failed"
                                            ? "text-[#f64949fe]"
                                            : "text-[#2ba150fe]"
                                        } mt-0.5`}
                                >
                                    {errMsg?.message}
                                </span>
                            )}

                            <div className='flex items-center justify-between py-4'>
                                <label
                                    htmlFor='imgUpload'
                                    className='flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer'
                                >
                                    <BiImages />
                                    <span>Image</span>
                                </label>

                                <label
                                    className='flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer'
                                    htmlFor='videoUpload'
                                >
                                    <BiSolidVideo />
                                    <span>Video</span>
                                </label>

                                <label
                                    className='flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer'
                                    htmlFor='vgifUpload'
                                >
                                    <BsFiletypeGif />
                                    <span>Gif</span>
                                </label>

                                <div>
                                    {posting ? (
                                        <Loading />
                                    ) : (
                                        <CustomButton
                                            type='submit'
                                            title='Post'
                                            containerStyles='bg-[#0444a4] text-white py-1 px-6 rounded-full font-semibold text-sm'
                                        />
                                    )}
                                </div>
                            </div>
                        </form>

                        {loading ? (
                            <Loading />
                        ) : posts?.length > 0 ? (
                            posts?.map((post) => (
                                <PostCard
                                    key={post?._id}
                                    post={post}
                                    user={user}
                                    deletePost={handleDeletePost}
                                    likePost={handleLikePost}
                                />
                            ))
                        ) : (
                            <div className='flex w-full h-full items-center justify-center'>
                                <p className='text-lg text-ascent-2'>No Post Available</p>
                            </div>
                        )}
                    </div>

                    {/* RIGJT */}
                    <div className='hidden w-1/4 h-full lg:flex flex-col gap-8 overflow-y-auto'>
                        {/* FRIEND REQUEST */}
                        <div className='w-full bg-primary shadow-sm rounded-lg px-6 py-5'>
                            <div className='flex items-center justify-between text-xl text-ascent-1 pb-2 border-b border-[#66666645]'>
                                <span> Friend Request</span>
                                <span>{friendRequest?.length}</span>
                            </div>

                            <div className='w-full flex flex-col gap-4 pt-4'>
                                {friendRequest?.map(({ _id, requestFrom: from }) => (
                                    <div key={_id} className='flex items-center justify-between'>
                                        <Link
                                            to={"/profile/" + from._id}
                                            className='w-full flex gap-4 items-center cursor-pointer'
                                        >
                                            <img
                                                src={from?.profileUrl ?? NoProfile}
                                                alt={from?.firstName}
                                                className='w-10 h-10 object-cover rounded-full'
                                            />
                                            <div className='flex-1'>
                                                <p className='text-base font-medium text-ascent-1'>
                                                    {from?.firstName} {from?.lastName}
                                                </p>
                                                <span className='text-sm text-ascent-2'>
                                                    {from?.profession ?? "No Profession"}
                                                </span>
                                            </div>
                                        </Link>

                                        <div className='flex gap-1'>
                                            <CustomButton
                                                title='Accept'
                                                containerStyles='bg-[#0444a4] text-xs text-white px-1.5 py-1 rounded-full'
                                                onClick={acceptFriendRequest(_id, "Accepted")}
                                            />
                                            <CustomButton
                                                title='Deny'
                                                containerStyles='border border-[#666] text-xs text-ascent-1 px-1.5 py-1 rounded-full'
                                                onClick={acceptFriendRequest(_id, "Denied")}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* SUGGESTED FRIENDS */}
                        <div className='w-full bg-primary shadow-sm rounded-lg px-5 py-5'>
                            <div className='flex items-center justify-between text-lg text-ascent-1 border-b border-[#66666645]'>
                                <span>Friend Suggestion</span>
                            </div>
                            <div className='w-full flex flex-col gap-4 pt-4'>
                                {suggestedFriends?.map((friend) => (
                                    <div
                                        className='flex items-center justify-between'
                                        key={friend._id}
                                    >
                                        <Link
                                            to={"/profile/" + friend?._id}
                                            key={friend?._id}
                                            className='w-full flex gap-4 items-center cursor-pointer'
                                        >
                                            <img
                                                src={friend?.profileUrl ?? NoProfile}
                                                alt={friend?.firstName}
                                                className='w-10 h-10 object-cover rounded-full'
                                            />
                                            <div className='flex-1 '>
                                                <p className='text-base font-medium text-ascent-1'>
                                                    {friend?.firstName} {friend?.lastName}
                                                </p>
                                                <span className='text-sm text-ascent-2'>
                                                    {friend?.profession ?? "No Profession"}
                                                </span>
                                            </div>
                                        </Link>

                                        <div className='flex gap-1'>
                                            <button
                                                className='bg-[#0444a430] text-sm text-white p-1 rounded'
                                                onClick={() => handleFriendRequest(friend?._id)}
                                            >
                                                <BsPersonFillAdd size={20} className='text-[#0f52b6]' />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {edit && <EditProfile />}
        </>
    );
};

export default Home;