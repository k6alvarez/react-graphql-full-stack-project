import Head from "next/head";

const Meta = props => {
  return (
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />
      <meta name="Description" content="Gillette Kennels" />
      <meta
        name="KeyWords"
        content="dogs, cats, boarding, kalamazoo, portage, battle creek, galesburg, kennel, training, puppy, obedience"
      />
      <link rel="shortcut icon" href="/static/favicon.ico" />
      <link rel="stylesheet" type="text/css" href="/static/nprogress.css" />
      <title>Gillette Kennels | Kalamazoo, MI | Boarding</title>
    </Head>
  );
};

export default Meta;
