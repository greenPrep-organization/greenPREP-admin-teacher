const writingMockData = {
  GDD210011: {
    part1: {
      instructions: 'Answer the following questions in about 150 words:',
      questions: [
        'Describe your favorite place to study and explain why you like it.',
        'What are the most important qualities of a good teacher?'
      ],
      answers: [
        "My favorite place to study is the university library because it's quiet and has all the resources I need. The atmosphere helps me concentrate better.",
        'I think good teachers should be knowledgeable, patient, and passionate about teaching. They should also be able to explain complex concepts in simple terms.'
      ]
    },
    part2: {
      instructions: 'Write an essay about the following topic in about 250 words:',
      questions: [
        'Do you think online education can replace traditional classroom learning? Give reasons and examples.'
      ],
      answers: [
        'I believe online education complements traditional classroom learning but cannot fully replace it. While online courses offer flexibility and accessibility, they lack the human interaction and immediate feedback that classroom settings provide. However, a blend of both approaches might be ideal for modern education.'
      ]
    },
    part3: {
      instructions: 'Write a letter to a friend describing:',
      questions: ['Your recent vacation and the places you visited'],
      answers: [
        "Dear Alex, I've just returned from an amazing trip to Japan. The culture, food, and people were incredible. I visited Tokyo, Kyoto, and Osaka, each offering unique experiences. Tokyo was bustling with energy, while Kyoto offered a glimpse into traditional Japanese culture."
      ]
    },
    part4: {
      instructions: 'Summarize the following passage in about 100 words:',
      questions: ['Environmental conservation text provided during the exam'],
      answers: [
        'The passage discusses the importance of environmental conservation and sustainable practices. It highlights how individual actions collectively contribute to global environmental health and suggests practical steps people can take in their daily lives.'
      ]
    }
  },
  GDD210012: {
    part1: {
      instructions: 'Answer the following questions in about 150 words:',
      questions: [
        'Describe your favorite place to study and explain why you like it.',
        'What are the most important qualities of a good teacher?'
      ],
      answers: [
        'I prefer studying at coffee shops because the ambient noise helps me focus. I like being around other people who are also working, it creates a productive atmosphere.',
        'The most important qualities of a good teacher include the ability to inspire students, create engaging lessons, and adapt teaching methods to different learning styles.'
      ]
    },
    part2: {
      instructions: 'Write an essay about the following topic in about 250 words:',
      questions: [
        'Do you think online education can replace traditional classroom learning? Give reasons and examples.'
      ],
      answers: [
        'While online education provides flexibility and accessibility, traditional classrooms offer irreplaceable face-to-face interactions. I believe a hybrid model works best, combining the technological advantages of online platforms with the social and practical benefits of physical classrooms.'
      ]
    },
    part3: {
      instructions: 'Write a letter to a friend describing:',
      questions: ['Your recent vacation and the places you visited'],
      answers: [
        'Dear Sam, I just got back from an incredible hiking trip in the mountains. We explored several trails, camped under the stars, and even spotted some wildlife. The scenery was breathtaking, especially at sunrise when the peaks were bathed in golden light.'
      ]
    },
    part4: {
      instructions: 'Summarize the following passage in about 100 words:',
      questions: ['Environmental conservation text provided during the exam'],
      answers: [
        'The passage explains various approaches to environmental conservation, emphasizing the importance of both individual and collective action. It suggests that sustainable practices should be integrated into education systems globally to foster environmental awareness from an early age.'
      ]
    }
  },
  GDD210013: {
    part1: {
      instructions: 'Answer the following questions in about 150 words:',
      questions: [
        'Describe your favorite place to study and explain why you like it.',
        'What are the most important qualities of a good teacher?'
      ],
      answers: [
        'I like studying in parks when the weather is nice. Being surrounded by nature helps me stay relaxed and focused. The fresh air clears my mind and improves my concentration.',
        "I believe good teachers should be empathetic, knowledgeable in their subject, and able to adapt their teaching style to different students' needs. They should also encourage critical thinking rather than memorization."
      ]
    },
    part2: {
      instructions: 'Write an essay about the following topic in about 250 words:',
      questions: [
        'Do you think online education can replace traditional classroom learning? Give reasons and examples.'
      ],
      answers: [
        'Online education and traditional classroom learning each have distinct advantages. Online platforms offer unprecedented access to education for people in remote areas and those with mobility limitations. However, traditional classrooms foster social skills and provide structured learning environments that many students need to succeed.'
      ]
    },
    part3: {
      instructions: 'Write a letter to a friend describing:',
      questions: ['Your recent vacation and the places you visited'],
      answers: [
        "Dear Jamie, I've just returned from a wonderful cultural tour of Europe. I visited museums in Paris, historical sites in Rome, and beautiful architecture in Barcelona. Each city had its own unique charm and taught me something different about European history and art."
      ]
    },
    part4: {
      instructions: 'Summarize the following passage in about 100 words:',
      questions: ['Environmental conservation text provided during the exam'],
      answers: [
        'The passage outlines critical environmental challenges facing our planet and proposes a framework for addressing them through policy changes, technological innovation, and public awareness campaigns. It emphasizes that solutions must be implemented at local, national, and international levels simultaneously.'
      ]
    }
  },
  GDD210014: {
    part1: {
      instructions: 'Answer the following questions in about 150 words:',
      questions: [
        'Describe your favorite place to study and explain why you like it.',
        'What are the most important qualities of a good teacher?'
      ],
      answers: [
        "My bedroom is my favorite study place because I can control the environment completely - the lighting, temperature, and noise level. I've arranged my desk to have everything I need within reach.",
        'Good teachers should have expertise in their subject, strong communication skills, patience, and genuine interest in student success. They should also be approachable so students feel comfortable asking questions.'
      ]
    },
    part2: {
      instructions: 'Write an essay about the following topic in about 250 words:',
      questions: [
        'Do you think online education can replace traditional classroom learning? Give reasons and examples.'
      ],
      answers: [
        'Traditional classroom learning provides irreplaceable benefits that online education cannot fully replicate. The social interaction, immediate feedback, and structured environment help students develop not only academic knowledge but also social skills essential for their future careers.'
      ]
    },
    part3: {
      instructions: 'Write a letter to a friend describing:',
      questions: ['Your recent vacation and the places you visited'],
      answers: [
        'Dear Taylor, I recently took a road trip along the coast, stopping at small towns and hidden beaches. The journey itself was as rewarding as the destinations, with stunning scenic routes and unexpected discoveries along the way. I particularly loved the local seafood restaurants in fishing villages.'
      ]
    },
    part4: {
      instructions: 'Summarize the following passage in about 100 words:',
      questions: ['Environmental conservation text provided during the exam'],
      answers: [
        'The passage discusses recent research on environmental conservation strategies, highlighting the importance of biodiversity protection, sustainable resource management, and community engagement. It presents several case studies where these approaches have been successfully implemented in different ecological contexts.'
      ]
    }
  },
  GDD210015: {
    part1: {
      instructions: 'Answer the following questions in about 150 words:',
      questions: [
        'Describe your favorite place to study and explain why you like it.',
        'What are the most important qualities of a good teacher?'
      ],
      answers: [
        'The university study hall is ideal for me because it combines quiet individual spaces with collaborative areas. The availability of resources like reference books and fast internet makes research efficient.',
        'The best teachers demonstrate passion for their subject, explain concepts clearly, provide constructive feedback, and create a supportive classroom environment where students feel valued and encouraged to participate.'
      ]
    },
    part2: {
      instructions: 'Write an essay about the following topic in about 250 words:',
      questions: [
        'Do you think online education can replace traditional classroom learning? Give reasons and examples.'
      ],
      answers: [
        'Online education offers remarkable advantages in terms of accessibility and flexibility, allowing students to learn at their own pace and from anywhere in the world. However, it faces challenges in replicating the hands-on learning experiences and immediate teacher feedback that traditional classrooms provide naturally.'
      ]
    },
    part3: {
      instructions: 'Write a letter to a friend describing:',
      questions: ['Your recent vacation and the places you visited'],
      answers: [
        'Dear Jordan, I just returned from an adventure in South America where I explored ancient ruins, hiked through rainforests, and experienced vibrant local cultures. The diversity of landscapes and the warmth of the people made this trip unforgettable. I even tried paragliding off coastal cliffs!'
      ]
    },
    part4: {
      instructions: 'Summarize the following passage in about 100 words:',
      questions: ['Environmental conservation text provided during the exam'],
      answers: [
        'The passage examines how technological innovations are transforming environmental conservation efforts, from satellite tracking of endangered species to AI-powered climate modeling. It argues that while technology offers powerful new tools, successful conservation still requires policy support and community engagement.'
      ]
    }
  }
}

export default writingMockData
