function Morphology() {
  return (
    <main className="container px-4 py-4">
      <article>
        <section>
          <h3 className="h3 text-success">Зовнішній вигляд</h3>
          <p>Бізони — це великі тварини з масивним тілом і густим хутром, яке зазвичай має коричневий колір. Вони мають велику голову, короткі роги, міцні ноги та горб на спині.</p>
        </section>
        <section>
          <h3 className="h3 text-success">Особливості будови</h3>
          <ul>
            <li>Довжина тіла бізона становить 2,5–3,5 метра, висота в загривку — до 2 метрів, вага — від 500 до 1000 кг і більше.</li>
            <li>Передня частина тіла масивніша за задню, з добре вираженим горбом над плечима; ноги короткі, але сильні.</li>
            <li>Голова велика з короткими загнутими рогами; шия і плечі вкриті густою шерстю, що утворює «гриву».</li>
          </ul>
        </section>
        <figure className="text-center">
          <img src="https://s3.animalia.bio/animals/photos/full/original/1428px-tender-moment-14833838067jpg.webp" alt="Фото бізона" className="img-fluid rounded my-4"/>
          <figcaption className="text-muted">Молодий бізон</figcaption>
        </figure>
      </article>
    </main>
  );
}

export default Morphology;