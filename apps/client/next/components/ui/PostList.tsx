"use client";

import React from 'react'
import {type PostResponse} from '@reddit-clone/shared';

function PostList({posts}: {posts: PostResponse[]}) {

    if (posts.length === 0) {
        return (
            <div className="flex flex-col gap-4">
                <p>No posts available.</p>
            </div>
        );
    }
  return (
    <div>
        <div className="flex flex-col gap-4">
            {posts.map((post) => (
                <div 
                    key={post.id} 
                    className="border p-4 rounded-md"
                >
                    <h2 className="text-lg font-semibold">{post.title}</h2>
                    <p>{post.content}</p>
                    <p className="text-sm text-gray-500">Created at: {new Date(post.created_at).toLocaleString()}</p>
                    <p className="text-sm text-gray-500">Updated at: {new Date(post.updated_at).toLocaleString()}</p>
                </div>
            ))}
        </div>
      
    </div>
  )
}

export default PostList
