//This file queries 1 film.

import { gql, GraphQLClient } from "graphql-request";
import { useState } from "react";

// this gets all the data I need from graphQL
export const getServerSideProps = async (pageContext) => {
	const url = process.env.ENDPOINT;
	const graphQLClient = new GraphQLClient(url, {
		headers: {
			Authorization: process.env.GRAPH_CMS_TOKEN,
		},
	});
	const pageSlug = pageContext.query.slug;

	const query = gql`
		query ($pageSlug: String!) {
			video(where: { slug: $pageSlug }) {
				createdAt
				id
				title
				description
				seen
				slug
				tags
				thumbnail {
					url
				}
				mp4 {
					url
				}
			}
		}
	`;

	//more graphql data fetching logic
	const variables = {
		pageSlug,
	};

	const data = await graphQLClient.request(query, variables);
	const video = data.video;

	return {
		props: {
			video,
		},
	};
};

const changeToSeen = async (slug) => {
	await fetch("/api/changeToSeen", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ slug }),
	});
};

const Video = ({ video }) => {
	const [watching, setWatching] = useState(false);

	return (
		<>
			{!watching && (
				<img
					className="video-image"
					src={video.thumbnail.url}
					alt={video.title}
				/>
			)}
			{!watching && (
				<div className="info">
					<p>{video.tags.join(", ")}</p>
					<p>{video.description}</p>
					<a href="/">
						<p>go back</p>
					</a>
					<button
						className="video-overlay"
						onClick={() => {
							changeToSeen(video.slug);
							// state is false to start, if they are watching, state switches to true
							watching ? setWatching(false) : setWatching(true);
						}}
					>
						PLAY
					</button>
				</div>
			)}
			{/* if watching is true, show the following elements */}
			{watching && (
				<video width="100%" controls>
					<source src={video.mp4.url} type="video/mp4" />
				</video>
			)}
			<div
				className="info-footer"
				onClick={() => (watching ? setWatching(false) : null)}
			></div>
		</>
	);
};

export default Video;
