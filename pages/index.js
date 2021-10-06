import { gql, GraphQLClient } from "graphql-request";
import Link from "next/link";
import Image from "next/image";
import Section from "../components/Section";
import NavBar from "../components/NavBar";
import disneyLogo from "../public/images/disney-button.png";
import marvelLogo from "../public/images/marvel-button.png";
import natgeoLogo from "../public/images/natgeo-button.png";
import starwarsLogo from "../public/images/star-wars-button.png";
import pixarLogo from "../public/images/pixar.png";

// this connects to all my graphql stuff
export const getStaticProps = async () => {
	const url = process.env.ENDPOINT;
	const graphQLClient = new GraphQLClient(url, {
		headers: {
			Authorization: process.env.GRAPH_CMS_TOKEN,
		},
	});

	//this is my query to Graphql
	const videosQuery = gql`
		query {
			videos {
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

	const accountQuery = gql`
		query {
			account(where: { id: "cktvssv2gdll30b23zgjxl63g" }) {
				username
				avatar {
					url
				}
			}
		}
	`;

	//this is for the data that i'm getting from Graphql
	const data = await graphQLClient.request(videosQuery);
	const videos = data.videos;
	const accountData = await graphQLClient.request(accountQuery);
	const account = accountData.account;

	return {
		props: {
			videos,
			account,
		},
	};
};

const Home = ({ videos, account }) => {
	const randomVideo = (videos) => {
		// math.floor rounds down to the nearest number
		return videos[Math.floor(Math.random() * videos.length)];
	};

	const filterVideos = (videos, genre) => {
		return videos.filter((video) => video.tags.includes(genre));
	};

	const unSeenVideos = (videos) => {
		return videos.filter(
			// return videos that haven't been seen
			(video) => video.seen === false || video.seen === null
		);
	};

	console.log(
		"not seen:",
		videos.filter((video) => video.seen === false || video.seen === null)
	);

	return (
		<>
			{/* this starts all the logic for actually populating the page with videos */}
			<NavBar account={account} />
			<div className="app">
				<div className="main-video">
					<img
						src={randomVideo(videos).thumbnail.url}
						alt={randomVideo(videos).title}
					/>
				</div>

				<div className="video-feed">
					<Link href="#disney">
						<div className="franchise" id="disney">
							<Image src={disneyLogo} />
						</div>
					</Link>
					<Link href="#pixar">
						<div className="franchise" id="pixar">
							<Image src={pixarLogo} />
						</div>
					</Link>
					<Link href="#star-wars">
						<div className="franchise" id="star-wars">
							<Image src={starwarsLogo} />
						</div>
					</Link>
					<Link href="#nat-geo">
						<div className="franchise" id="nat-geo">
							<Image src={natgeoLogo} />
						</div>
					</Link>
					<Link href="#marvel">
						<div className="franchise" id="marvel">
							<Image src={marvelLogo} />
						</div>
					</Link>
				</div>
				<Section genre={"Recommended for you"} videos={unSeenVideos(videos)} />
				<Section genre={"Family"} videos={filterVideos(videos, "family")} />
				<Section genre={"Thriller"} videos={filterVideos(videos, "thriller")} />
				<Section genre={"Classic"} videos={filterVideos(videos, "classic")} />
				<Section
					id="pixar"
					genre={"Pixar"}
					videos={filterVideos(videos, "pixar")}
				/>
				<Section
					id="marvel"
					genre={"Marvel"}
					videos={filterVideos(videos, "marvel")}
				/>
				<Section
					id="nat-geo"
					genre={"National Geographic"}
					videos={filterVideos(videos, "national-geographic")}
				/>
				<Section
					id="disney"
					genre={"Disney"}
					videos={filterVideos(videos, "disney")}
				/>
				<Section
					id="star-wars"
					genre={"Star Wars"}
					videos={filterVideos(videos, "star-wars")}
				/>
			</div>
		</>
	);
};

export default Home;
