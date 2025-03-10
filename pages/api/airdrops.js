export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Manually defined airdrops
    const airdrops = [
      {
        id: '1',
        name: 'Layeredge',
        description: 'Next-generation Layer 2 solution for Bitcoin',
        url: 'https://www.layeredge.io/',
        logo: 'data:image/png;base64,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',
        endDate: 'ongoing'
      },
      {
        id: '2',
        name: 'Blum',
        description: 'Decentralized finance protocol with innovative tokenomics',
        url: 'https://t.me/blum/app?startapp=ref_suXaFBDJxN',
        logo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAMAAACahl6sAAAAZlBMVEUAAAD////+/v43NzeAgID7+/vIyMjf399wcHAEBASQkJAfHx+goKD4+PhZWVkJCQlgYGA1NTU9PT0cHBxmZmaxsbEwMDAoKCjn5+eLi4t0dHTDw8PZ2dkWFhZqamru7u57e3u7u7sU2vkBAAAETElEQVR4nO2di3ajIBCGhYRuaMo2Mb1uu7f3f8llMFHUAdM9pzrS/29PThsh4XNQB3DGqoIgCIIgCIIgCIIgCIIgqKpsVd37n94b55c1yvb/WStH3PK1MjSKW2/tWk1CB0jbcBu9rk61Uka10upujRahFj9FHM5D3dn1cZDshsxwkVH6bq19axNxhK61dIP+VwCRJoBIE0CkaS0gNjiCmY3HvoeSB1nwUpn/aksW6UjINjmQxYZdV3ynPToXdS1nJpzG+8y2ZXVUuj1I3JRFFutap/pY1/Umpbo+bh6Mjg4R7R7TxTdPtK1ewipbalp8VurL0FFh4tOWacySqaHMfn6Oaht2t9EpKW0GJy3ja2TKE+d+CYv4xpm0RUJnik1AEFl7kEWe5+cIXUvlmvYxhc/Si3QtgAAEIAABiEiQ4bX9LKf4WoY8zA7EzubXT4CQ0zGmCBDacIDeg1HqFH2B7U2CLwbS7GQ38q1c40xyhvJbTq2vZWdbF5oEMbxJaM+TTcbUniSyiK1mQpnqWr5zvbzevt6O9Hr7xtULLv921+oH/X4+xhUgSt3wTvn9jvGDjTp7wL1dMYdXP20RdZM4WH8xJ67QD004SbTjE6Nm4LjCIuaGr2l33MHTXEhiG3k2AadfUgKk2iUuJcM9oSRYBCAAAQhAAAIQgAAEIAABCEAAAhCAAAQgXwqEZttuuPk1SyB6VFEPJr2bAiJANGsRYtux9Wjmt5ulN4aWiQSAqADCm4TrWno0i6plzP1SN3lj1jdoAWfnxpO/fve7eNkkWEQECK3mvL+8fxuI3vjN1Qv339T7Vs/759NPCcsKhl9i8y3WSrMHu9+0H8RkzaFpi2jDoKTuPQtlXW95eqZQpivOWmyB82IOU0HFy9PVbPecfp0bBgACEIAABCALgCQviFGR4QBE6AWRd1EuOt+O0o0/xLooSaexa7qJ3HnJTiPrxnfu/EvfnZfqxqcGVhfRAGurddS15A6sEkPdDmUb9T2xQ93U5EPvI3qjE6GTD8npoE52G01CiJ0OIk1aJN8zAQIQgAAEIABpxYWDrBKko7n8aenKnnb0xYIwnvCfXGWxIF7777EOh8dcsK9gEPvgumAEk462kg1C/ep7tC3EvWTi4cWCUBzboTd6clPjMqkgVXWI+lJYJlnlWSuAfGBCDyAAAQhAAPKlQTQTUPnA3SjQVdB930tIQOV5yjRKymp7V/ZxebkhroOgYw/ixlPV7f5XcoOOR2Hgf5Olldww8HFgfpPMKQOiRAbmN23rUiWEVbZMcbGpEpjkFZRzK7fEJTV5he6nEzEqkZcj3i4wnchHJfaGAYAABCAAAcgngahSEk4WkwJUF5KUtZg0uVdoFYmLS0olXUZy76qgdOuTWksC/EkBRJoAIk0AkaZSQMp4IFdJj0gr46F1VUmPESzlwY4lPWqzhIefFvY4WgiCIAiCIAiCIAiCIAj6TP0DLD1ItO1Gm8QAAAAASUVORK5CYII=',
        endDate: 'ongoing'
      },
      {
        id: '3',
        name: 'Monad Testnet',
        description: 'High-performance blockchain designed for scalability and throughput',
        url: 'https://testnet.monad.xyz/',
        logo: 'data:image/jpeg;base64,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',
        endDate: 'ongoing'
      },
      {
        id: '4',
        name: 'Catizen',
        description: 'NFT platform focused on digital collectibles and gaming',
        url: 'https://catizen.ai/',
        logo: 'data:image/jpeg;base64,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',
        endDate: 'Ongoing'
      }
    ];

    return res.status(200).json(airdrops);
  } catch (error) {
    console.error('Error serving airdrops:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}