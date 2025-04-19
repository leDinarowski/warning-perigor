let textSwapped = false;

const originalText = "Role a página para saber mais";
const swappedText = "Raspe para revelar o suspeito";
let scratchActivated = false;

document.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  const windowHeight = window.innerHeight;
  const totalPieces = 9;
  const maxScroll = document.body.scrollHeight - windowHeight;
  const pieceStep = maxScroll / totalPieces;
  const lastThreshold = pieceStep * (totalPieces - 1);

  const heroText = document.querySelector(".hero-text");
  const scratchContainer = document.getElementById("js--sc--container");

  // ===== Animação de movimento do texto =====
  const scrollProgress = Math.min(scrollY / lastThreshold, 1); // 0 a 1
  const translateY = 50 + scrollProgress * 40; // de 50% a 90%
  const scale = 3 - scrollProgress * 1.5; // de 3rem para 1.5rem
  const opacity = 1 - scrollProgress * 0.7; // de 1 para 0.3

  heroText.style.top = `${translateY}%`;
  heroText.style.fontSize = `${scale}rem`;
  heroText.style.opacity = opacity;

  // ===== Substituição gradual de letras =====
  const wordProgress = Math.min(scrollY / lastThreshold, 1);
  const numLettersToChange = Math.floor(wordProgress * originalText.length);

  let transformedText = "";

  for (let i = 0; i < originalText.length; i++) {
    if (i < numLettersToChange) {
      transformedText += swappedText[i] || "";
    } else {
      transformedText += originalText[i] || "";
    }
  }

  heroText.textContent = transformedText;

  // ===== Troca de texto final =====
  if (scrollY >= lastThreshold && !textSwapped) {
    textSwapped = true;
    heroText.style.opacity = 0;

    setTimeout(() => {
      heroText.textContent = swappedText;
      heroText.style.opacity = opacity;
    }, 300);
  }

  if (scrollY < lastThreshold && textSwapped) {
    textSwapped = false;
    heroText.style.opacity = 0;

    setTimeout(() => {
      heroText.textContent = originalText;
      heroText.style.opacity = opacity;
    }, 300);
  }

  // ===== Mostrar / esconder peças =====
  for (let i = 1; i <= totalPieces; i++) {
    const piece = document.getElementById(`piece-${i}`);
    const trigger = pieceStep * (i - 1);

    if (scrollY > trigger) {
      piece.style.opacity = "1";
      piece.style.transform = "scale(1)";
      
      // Carregar imagens nas peças
      const row = Math.ceil(i / 3); // Linha da peça (1, 2, 3)
      const column = i % 3 || 3; // Coluna da peça (1, 2, 3)
      piece.style.backgroundImage = `url('images/row-${row}-column-${column}.jpg')`; 
    } else {
      piece.style.opacity = "0";
      piece.style.transform = "scale(0.8)";
      piece.style.backgroundImage = 'none'; // Remover imagem quando a peça não for visível
    }
  }

  // ===== Ativar raspadinha após o scroll completo =====
  if (scrollY >= maxScroll && !scratchActivated) {
    scratchActivated = true;
    // Exibir o contêiner da raspadinha
    scratchContainer.style.display = "block";

    // Inicializar o efeito da raspadinha
    const scContainer = document.getElementById("js--sc--container");
    const sc = new ScratchCard("#js--sc--container", {
      scratchType: SCRATCH_TYPE.LINE,
      containerWidth: scContainer.offsetWidth,
      containerHeight: 300,
      imageForwardSrc: "https://masth0.github.io/ScratchCard/images/scratchcard.jpg", // Imagem da raspadinha
      imageBackgroundSrc: "https://masth0.github.io/ScratchCard/images/result.png", // Imagem a ser revelada
      clearZoneRadius: 20,
      nPoints: 0,
      pointSize: 0,
      callback: function () {
        // Ação após a raspadinha ser completada
        window.location.reload();
      }
    });

    // Init da raspadinha
    sc.init().then(() => {
      sc.canvas.addEventListener("scratch.move", () => {
        let percent = sc.getPercent().toFixed(0);
        console.log(percent); // Você pode exibir a porcentagem ou usá-la conforme necessário
      });
    }).catch((error) => {
      alert(error.message); // Caso a imagem não carregue
    });
  }
});
