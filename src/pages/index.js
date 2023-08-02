import MeetupList from "@/components/meetups/MeetupList";
import MongoClient from "mongodb/lib/mongo_client";
import Head from "next/head";
function HomePage(props) {
  return (
    <>
      <Head>
        <title>NextJS Meetups</title>
        <meta
          name="description"
          content="Browse a huge list of highly active NextJS meetups!"
        />
      </Head>
      <MeetupList meetups={props.meetups} />
    </>
  );
}

export async function getStaticProps() {
  // fetch data from API
  const client = await MongoClient.connect(
    process.env.MONGO_URL
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");
  const meetups = await meetupsCollection.find().toArray();
  client.close();
  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
      })),
    },
    revalidate: 1,
  };
}

// export async function getServerSideProps(context) {
//   const req = context.req;
//   const res = context.res;
//   // fetch data
//   return {
//     props: { meetups: DUMMY_MEETUPS },
//   };
// }

export default HomePage;
