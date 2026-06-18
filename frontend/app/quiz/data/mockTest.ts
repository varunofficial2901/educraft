export type QuizOption = { id: string; text: string };
export type QuizQuestion = {
  id: number;
  text: string;
  passageKey?: string; // for reading assessment — passage shown separately
  topic: string;
  difficulty: string;
  options: QuizOption[];
  correctAnswer: string;
};
export type QuizTest = {
  id: string;
  title: string;
  subtitle: string;
  totalQuestions: number;
  totalMarks: number;
  durationMinutes: number;
  bundle: string;
  questions: QuizQuestion[];
  type?: "mcq" | "writing";
};

// ─── TEST 1: MATHEMATICAL REASONING FREE ASSESSMENT ───
export const mathAssessment: QuizTest = {
  id: "mathematics-assessment-1",
  title: "Mathematical Reasoning Free Assessment",
  subtitle: "35 Questions | 40 Minutes | No Calculator",
  totalQuestions: 35,
  totalMarks: 35,
  durationMinutes: 40,
  bundle: "Mathematical Reasoning Free Assessment",
  questions: [
    {
      id: 1,
      text: "A box of 24 chocolates is shared equally among 6 friends. Each friend then gives 2 chocolates to their younger sibling. How many chocolates does each friend have left?",
      topic: "Number Sense & Algebra",
      difficulty: "easy",
      options: [
        { id: "A", text: "2" },
        { id: "B", text: "4" },
        { id: "C", text: "6" },
        { id: "D", text: "3" },
      ],
      correctAnswer: "A",
    },
    {
      id: 2,
      text: "A shirt costs $60. It is first discounted by 25%, then a further 10% is taken off the reduced price. What is the final price?",
      topic: "Number Sense & Algebra",
      difficulty: "medium",
      options: [
        { id: "A", text: "$37.50" },
        { id: "B", text: "$40.50" },
        { id: "C", text: "$39.00" },
        { id: "D", text: "$36.00" },
      ],
      correctAnswer: "B",
    },
    {
      id: 3,
      text: "A recipe uses 3 cups of flour for every 2 cups of sugar. If a baker wants to use 15 cups of flour, how many cups of sugar does she need?",
      topic: "Number Sense & Algebra",
      difficulty: "medium",
      options: [
        { id: "A", text: "8" },
        { id: "B", text: "9" },
        { id: "C", text: "10" },
        { id: "D", text: "12" },
      ],
      correctAnswer: "C",
    },
    {
      id: 4,
      text: "Emma is 3 times as old as her brother Tom. In 8 years, Emma will be twice as old as Tom. How old is Tom now?",
      topic: "Number Sense & Algebra",
      difficulty: "hard",
      options: [
        { id: "A", text: "4" },
        { id: "B", text: "6" },
        { id: "C", text: "8" },
        { id: "D", text: "10" },
      ],
      correctAnswer: "C",
    },
    {
      id: 5,
      text: "A number gives a remainder of 4 when divided by 7, and a remainder of 2 when divided by 5. What is the smallest such positive integer?",
      topic: "Number Sense & Algebra",
      difficulty: "hard",
      options: [
        { id: "A", text: "11" },
        { id: "B", text: "32" },
        { id: "C", text: "39" },
        { id: "D", text: "18" },
      ],
      correctAnswer: "B",
    },
    {
      id: 6,
      text: "Jack and Jill share $180 in the ratio 4:5. How much more does Jill receive than Jack?",
      topic: "Number Sense & Algebra",
      difficulty: "medium",
      options: [
        { id: "A", text: "$18" },
        { id: "B", text: "$20" },
        { id: "C", text: "$24" },
        { id: "D", text: "$30" },
      ],
      correctAnswer: "B",
    },
    {
      id: 7,
      text: "A store sells apples for $0.80 each and oranges for $1.20 each. Maya spends exactly $9.60 buying a total of 10 fruits. How many apples did she buy?",
      topic: "Number Sense & Algebra",
      difficulty: "hard",
      options: [
        { id: "A", text: "4" },
        { id: "B", text: "5" },
        { id: "C", text: "6" },
        { id: "D", text: "7" },
      ],
      correctAnswer: "C",
    },
    {
      id: 8,
      text: "A school has 240 students. 15% of them participate in the chess club. How many students are in the chess club?",
      topic: "Number Sense & Algebra",
      difficulty: "easy",
      options: [
        { id: "A", text: "24" },
        { id: "B", text: "30" },
        { id: "C", text: "36" },
        { id: "D", text: "40" },
      ],
      correctAnswer: "C",
    },
    {
      id: 9,
      text: "The sum of three consecutive even numbers is 78. What is the largest of the three numbers?",
      topic: "Number Sense & Algebra",
      difficulty: "hard",
      options: [
        { id: "A", text: "24" },
        { id: "B", text: "26" },
        { id: "C", text: "28" },
        { id: "D", text: "30" },
      ],
      correctAnswer: "C",
    },
    {
      id: 10,
      text: "A store marks up the cost price of a jacket by 40% to set the selling price. During a sale, the selling price is discounted by 20%. If the final sale price is $67.20, what was the original cost price?",
      topic: "Number Sense & Algebra",
      difficulty: "challenging",
      options: [
        { id: "A", text: "$55.00" },
        { id: "B", text: "$58.00" },
        { id: "C", text: "$60.00" },
        { id: "D", text: "$64.00" },
      ],
      correctAnswer: "C",
    },
    {
      id: 11,
      text: "A train departs at 08:45 and arrives at its destination at 11:20. How long is the journey?",
      topic: "Measurement",
      difficulty: "easy",
      options: [
        { id: "A", text: "2 hr 25 min" },
        { id: "B", text: "2 hr 35 min" },
        { id: "C", text: "2 hr 45 min" },
        { id: "D", text: "3 hr 5 min" },
      ],
      correctAnswer: "B",
    },
    {
      id: 12,
      text: "Two cyclists start from the same point at the same time, travelling in opposite directions. Cyclist A travels at 18 km/h and Cyclist B at 22 km/h. How far apart are they after 1.5 hours?",
      topic: "Measurement",
      difficulty: "medium",
      options: [
        { id: "A", text: "54 km" },
        { id: "B", text: "60 km" },
        { id: "C", text: "66 km" },
        { id: "D", text: "72 km" },
      ],
      correctAnswer: "B",
    },
    {
      id: 13,
      text: "A rectangular garden has a perimeter of 56 m. Its length is 6 m more than its width. What is the area of the garden?",
      topic: "Measurement",
      difficulty: "medium",
      options: [
        { id: "A", text: "160 m²" },
        { id: "B", text: "175 m²" },
        { id: "C", text: "187 m²" },
        { id: "D", text: "190 m²" },
      ],
      correctAnswer: "C",
    },
    {
      id: 14,
      text: "A car travels from City A to City B at 60 km/h and returns along the same route at 40 km/h. What is the average speed for the entire round trip?",
      topic: "Measurement",
      difficulty: "hard",
      options: [
        { id: "A", text: "48 km/h" },
        { id: "B", text: "50 km/h" },
        { id: "C", text: "52 km/h" },
        { id: "D", text: "54 km/h" },
      ],
      correctAnswer: "A",
    },
    {
      id: 15,
      text: "A water tank is three-quarters full and contains 270 litres. How many more litres are needed to fill the tank completely?",
      topic: "Measurement",
      difficulty: "medium",
      options: [
        { id: "A", text: "60 L" },
        { id: "B", text: "80 L" },
        { id: "C", text: "90 L" },
        { id: "D", text: "100 L" },
      ],
      correctAnswer: "C",
    },
    {
      id: 16,
      text: "A rectangular floor is 8 m long and 5 m wide. Square tiles of side 50 cm are used to cover the floor. How many tiles are needed?",
      topic: "Measurement",
      difficulty: "hard",
      options: [
        { id: "A", text: "120" },
        { id: "B", text: "140" },
        { id: "C", text: "160" },
        { id: "D", text: "180" },
      ],
      correctAnswer: "C",
    },
    {
      id: 17,
      text: "Pipe A fills a tank in 6 hours. Pipe B fills the same tank in 3 hours. If both pipes are open at the same time, how long will it take to fill the tank?",
      topic: "Measurement",
      difficulty: "easy",
      options: [
        { id: "A", text: "1.5 hours" },
        { id: "B", text: "2 hours" },
        { id: "C", text: "2.5 hours" },
        { id: "D", text: "4 hours" },
      ],
      correctAnswer: "B",
    },
    {
      id: 18,
      text: "A rectangular piece of wire is 18 cm long and 12 cm wide. The wire is straightened and then bent into a square. What is the side length of the square?",
      topic: "Measurement",
      difficulty: "challenging",
      options: [
        { id: "A", text: "12 cm" },
        { id: "B", text: "15 cm" },
        { id: "C", text: "16 cm" },
        { id: "D", text: "18 cm" },
      ],
      correctAnswer: "B",
    },
    {
      id: 19,
      text: "The three angles of a triangle are in the ratio 2:3:4. What is the size of the largest angle?",
      topic: "Geometry & Spatial Mathematics",
      difficulty: "medium",
      options: [
        { id: "A", text: "60°" },
        { id: "B", text: "72°" },
        { id: "C", text: "80°" },
        { id: "D", text: "90°" },
      ],
      correctAnswer: "C",
    },
    {
      id: 20,
      text: "A rectangle has vertices at coordinates (1,1), (5,1), (5,4), and (1,4). What is its perimeter?",
      topic: "Geometry & Spatial Mathematics",
      difficulty: "easy",
      options: [
        { id: "A", text: "12" },
        { id: "B", text: "14" },
        { id: "C", text: "16" },
        { id: "D", text: "20" },
      ],
      correctAnswer: "B",
    },
    {
      id: 21,
      text: "What is the angle between the hour hand and the minute hand on a clock showing 4:20?",
      topic: "Geometry & Spatial Mathematics",
      difficulty: "hard",
      options: [
        { id: "A", text: "5°" },
        { id: "B", text: "10°" },
        { id: "C", text: "15°" },
        { id: "D", text: "20°" },
      ],
      correctAnswer: "B",
    },
    {
      id: 22,
      text: "A cube has a total surface area of 216 cm². What is the volume of the cube?",
      topic: "Geometry & Spatial Mathematics",
      difficulty: "medium",
      options: [
        { id: "A", text: "125 cm³" },
        { id: "B", text: "216 cm³" },
        { id: "C", text: "343 cm³" },
        { id: "D", text: "512 cm³" },
      ],
      correctAnswer: "B",
    },
    {
      id: 23,
      text: "Two straight lines intersect. One of the angles formed is (3x + 15)° and the angle adjacent to it is (2x + 5)°. What is the value of x?",
      topic: "Geometry & Spatial Mathematics",
      difficulty: "challenging",
      options: [
        { id: "A", text: "28" },
        { id: "B", text: "30" },
        { id: "C", text: "32" },
        { id: "D", text: "35" },
      ],
      correctAnswer: "C",
    },
    {
      id: 24,
      text: "A semicircle is drawn on the hypotenuse of a right-angled triangle whose two shorter sides are 6 cm and 8 cm. What is the area of the semicircle? (Use π = 3.14)",
      topic: "Geometry & Spatial Mathematics",
      difficulty: "hard",
      options: [
        { id: "A", text: "39.25 cm²" },
        { id: "B", text: "78.50 cm²" },
        { id: "C", text: "28.26 cm²" },
        { id: "D", text: "56.52 cm²" },
      ],
      correctAnswer: "A",
    },
    {
      id: 25,
      text: "The mean of five numbers is 14. Four of the numbers are 10, 12, 16, and 18. What is the fifth number?",
      topic: "Data, Statistics & Probability",
      difficulty: "easy",
      options: [
        { id: "A", text: "12" },
        { id: "B", text: "14" },
        { id: "C", text: "16" },
        { id: "D", text: "18" },
      ],
      correctAnswer: "B",
    },
    {
      id: 26,
      text: "A bag contains 5 red, 3 blue, and 2 green marbles. One marble is drawn at random. What is the probability that it is NOT red?",
      topic: "Data, Statistics & Probability",
      difficulty: "medium",
      options: [
        { id: "A", text: "1/2" },
        { id: "B", text: "3/5" },
        { id: "C", text: "2/5" },
        { id: "D", text: "1/5" },
      ],
      correctAnswer: "A",
    },
    {
      id: 27,
      text: "In a class of 30 students, the mean test score is 72. The 10 boys in the class had a mean score of 60. What was the mean score of the 20 girls?",
      topic: "Data, Statistics & Probability",
      difficulty: "hard",
      options: [
        { id: "A", text: "74" },
        { id: "B", text: "76" },
        { id: "C", text: "78" },
        { id: "D", text: "80" },
      ],
      correctAnswer: "C",
    },
    {
      id: 28,
      text: "A spinner is divided into 8 equal sections numbered 1 to 8. What is the probability of spinning an even number greater than 4?",
      topic: "Data, Statistics & Probability",
      difficulty: "medium",
      options: [
        { id: "A", text: "1/4" },
        { id: "B", text: "3/8" },
        { id: "C", text: "1/2" },
        { id: "D", text: "5/8" },
      ],
      correctAnswer: "A",
    },
    {
      id: 29,
      text: "Seven data values are: 8, 11, x, 15, 19, y, and 28. When arranged in ascending order, the median is 15. The mean of all seven values is also 15. What is the value of x + y?",
      topic: "Data, Statistics & Probability",
      difficulty: "hard",
      options: [
        { id: "A", text: "20" },
        { id: "B", text: "22" },
        { id: "C", text: "24" },
        { id: "D", text: "26" },
      ],
      correctAnswer: "C",
    },
    {
      id: 30,
      text: "Two fair dice are rolled simultaneously. What is the probability that the sum of the two numbers shown is greater than 9?",
      topic: "Data, Statistics & Probability",
      difficulty: "challenging",
      options: [
        { id: "A", text: "1/6" },
        { id: "B", text: "1/4" },
        { id: "C", text: "1/9" },
        { id: "D", text: "1/12" },
      ],
      correctAnswer: "A",
    },
    {
      id: 31,
      text: "What is the next number in the sequence? 5, 11, 19, 29, 41, __",
      topic: "Numerical Sequences & Patterns",
      difficulty: "easy",
      options: [
        { id: "A", text: "53" },
        { id: "B", text: "55" },
        { id: "C", text: "57" },
        { id: "D", text: "59" },
      ],
      correctAnswer: "B",
    },
    {
      id: 32,
      text: "Find the missing term in the sequence: 3, 6, 12, __, 48, 96",
      topic: "Numerical Sequences & Patterns",
      difficulty: "medium",
      options: [
        { id: "A", text: "20" },
        { id: "B", text: "24" },
        { id: "C", text: "28" },
        { id: "D", text: "32" },
      ],
      correctAnswer: "B",
    },
    {
      id: 33,
      text: "In a sequence, each term after the first two is the sum of the two terms before it. The 4th term is 11 and the 6th term is 29. What is the 1st term?",
      topic: "Numerical Sequences & Patterns",
      difficulty: "hard",
      options: [
        { id: "A", text: "2" },
        { id: "B", text: "3" },
        { id: "C", text: "4" },
        { id: "D", text: "5" },
      ],
      correctAnswer: "B",
    },
    {
      id: 34,
      text: "A pattern of squares is built row by row: Row 1 has 1 square, Row 2 has 3 squares, Row 3 has 5 squares, and so on. How many squares are in Row 20?",
      topic: "Numerical Sequences & Patterns",
      difficulty: "challenging",
      options: [
        { id: "A", text: "37" },
        { id: "B", text: "39" },
        { id: "C", text: "40" },
        { id: "D", text: "41" },
      ],
      correctAnswer: "B",
    },
    {
      id: 35,
      text: "The first term of an arithmetic sequence is 7 and the common difference is 4. What is the sum of the first 10 terms?",
      topic: "Numerical Sequences & Patterns",
      difficulty: "hard",
      options: [
        { id: "A", text: "214" },
        { id: "B", text: "250" },
        { id: "C", text: "256" },
        { id: "D", text: "260" },
      ],
      correctAnswer: "B",
    },
  ],
};

// ─── TEST 2: THINKING SKILLS FREE ASSESSMENT ───
export const mockTest: QuizTest = {
  id: "reasoning-assessment-1",
  title: "Thinking Skills Free Assessment",
  subtitle: "40 Questions | 40 Minutes | 10 Sections",
  totalQuestions: 40,
  totalMarks: 40,
  durationMinutes: 40,
  bundle: "Thinking Skills Free Assessment",
  questions: [
    {
      id: 1,
      text: "All painters are artists.\nSome artists are musicians.\nNo musician is a doctor.\nWhich of the following must be true?",
      topic: "Logical Deduction",
      difficulty: "medium",
      options: [
        { id: "A", text: "All painters are musicians." },
        { id: "B", text: "Some artists are not doctors." },
        { id: "C", text: "No painter is a doctor." },
        { id: "D", text: "Some doctors are artists." },
      ],
      correctAnswer: "B",
    },
    {
      id: 2,
      text: "If it rains, the match is cancelled.\nIf the match is cancelled, the trophy is not awarded.\nThe trophy was awarded.\nWhat can be concluded?",
      topic: "Logical Deduction",
      difficulty: "hard",
      options: [
        { id: "A", text: "It rained." },
        { id: "B", text: "It did not rain." },
        { id: "C", text: "The match was not cancelled but it rained." },
        { id: "D", text: "Nothing can be concluded." },
      ],
      correctAnswer: "B",
    },
    {
      id: 3,
      text: "Every student who studies hard passes.\nSam did not pass.\nWhat must be true about Sam?",
      topic: "Logical Deduction",
      difficulty: "medium",
      options: [
        { id: "A", text: "Sam did not study hard." },
        { id: "B", text: "Sam studied hard." },
        { id: "C", text: "Sam is not a student." },
        { id: "D", text: "Sam will pass next time." },
      ],
      correctAnswer: "A",
    },
    {
      id: 4,
      text: "P is taller than Q. R is shorter than S. Q is taller than R. S is taller than P. Who is the tallest?",
      topic: "Logical Deduction",
      difficulty: "hard",
      options: [
        { id: "A", text: "P" },
        { id: "B", text: "Q" },
        { id: "C", text: "R" },
        { id: "D", text: "S" },
      ],
      correctAnswer: "D",
    },
    {
      id: 5,
      text: "No reptile is warm-blooded. All snakes are reptiles. Which must be true?",
      topic: "Logical Deduction",
      difficulty: "medium",
      options: [
        { id: "A", text: "Some snakes are warm-blooded." },
        { id: "B", text: "No snake is warm-blooded." },
        { id: "C", text: "All reptiles are snakes." },
        { id: "D", text: "Some reptiles are warm-blooded." },
      ],
      correctAnswer: "B",
    },
    {
      id: 6,
      text: "Five students A,B,C,D,E sat an exam. A scored higher than B. C scored higher than A. D scored lower than B. E scored between B and A. Who came third?",
      topic: "Ordering & Ranking",
      difficulty: "medium",
      options: [
        { id: "A", text: "A" },
        { id: "B", text: "B" },
        { id: "C", text: "C" },
        { id: "D", text: "E" },
      ],
      correctAnswer: "D",
    },
    {
      id: 7,
      text: "Six boxes stacked (1=bottom, 6=top). P is directly above Q. R is above P but not at top. S is at the bottom. T is directly below R. U is at the top. Order bottom to top?",
      topic: "Ordering & Ranking",
      difficulty: "hard",
      options: [
        { id: "A", text: "S, Q, P, T, R, U" },
        { id: "B", text: "Q, S, P, T, R, U" },
        { id: "C", text: "S, P, Q, R, T, U" },
        { id: "D", text: "S, Q, P, R, T, U" },
      ],
      correctAnswer: "A",
    },
    {
      id: 8,
      text: "In a race of 6, Mia finishes before Leo. Leo finishes before Priya. Kai finishes after Priya. Jess finishes between Mia and Leo. Which must be FALSE?",
      topic: "Ordering & Ranking",
      difficulty: "medium",
      options: [
        { id: "A", text: "Kai finishes last." },
        { id: "B", text: "Priya finishes 4th." },
        { id: "C", text: "Jess finishes 2nd." },
        { id: "D", text: "Mia finishes 3rd." },
      ],
      correctAnswer: "D",
    },
    {
      id: 9,
      text: "'go home now' = 4 6 3 | 'now eat well' = 3 2 5 | 'go eat fast' = 4 2 8\nWhat is the code for 'home'?",
      topic: "Coding & Cipher",
      difficulty: "medium",
      options: [
        { id: "A", text: "4" },
        { id: "B", text: "6" },
        { id: "C", text: "3" },
        { id: "D", text: "2" },
      ],
      correctAnswer: "B",
    },
    {
      id: 10,
      text: "RABBIT coded as 18122920 (A=1, B=2 … Z=26, double digits for letters >9).\nHow will FOX be coded?",
      topic: "Coding & Cipher",
      difficulty: "medium",
      options: [
        { id: "A", text: "61524" },
        { id: "B", text: "6624" },
        { id: "C", text: "62415" },
        { id: "D", text: "61525" },
      ],
      correctAnswer: "A",
    },
    {
      id: 11,
      text: "Coding by digit sum of alphabet position. (S=19→10→1, T=20→2, A=1, R=18→9)\nHow is STAR coded?",
      topic: "Coding & Cipher",
      difficulty: "hard",
      options: [
        { id: "A", text: "1219" },
        { id: "B", text: "2190" },
        { id: "C", text: "1291" },
        { id: "D", text: "1219" },
      ],
      correctAnswer: "A",
    },
    {
      id: 12,
      text: "Mathematics = { @ ' ( ^ { @ ' ) $ \"  |  Geography = * ^ [ * ; @ ] ( ~\nLiterature = = ) ' ^ ; @ ' < ; ^\nWhat is the encoding for 'I LOVE'?",
      topic: "Coding & Cipher",
      difficulty: "medium",
      options: [
        { id: "A", text: ") = [ > ^ ] ( ~ \" $ \"" },
        { id: "B", text: ") = [ > ; @ ] ( ~ \" $)" },
        { id: "C", text: "= ) [ > ^ ] @ ( ~ $" },
        { id: "D", text: ") = [ ^ > ] ( \" ~ $" },
      ],
      correctAnswer: "B",
    },
    {
      id: 13,
      text: "Train 1 travels 120 km in 2 hours. Train 2 travels the same distance but takes 30 minutes longer. Speed difference?",
      topic: "Mathematical Reasoning",
      difficulty: "medium",
      options: [
        { id: "A", text: "10 km/h" },
        { id: "B", text: "20 km/h" },
        { id: "C", text: "15 km/h" },
        { id: "D", text: "12 km/h" },
      ],
      correctAnswer: "D",
    },
    {
      id: 14,
      text: "A number divided by 5 leaves remainder 3. Same number divided by 7 leaves remainder 2. Smallest such positive integer?",
      topic: "Mathematical Reasoning",
      difficulty: "hard",
      options: [
        { id: "A", text: "23" },
        { id: "B", text: "58" },
        { id: "C", text: "33" },
        { id: "D", text: "43" },
      ],
      correctAnswer: "A",
    },
    {
      id: 15,
      text: "Ratio of red to blue marbles is 3:5. There are 24 red marbles. How many blue?",
      topic: "Mathematical Reasoning",
      difficulty: "medium",
      options: [
        { id: "A", text: "30" },
        { id: "B", text: "35" },
        { id: "C", text: "40" },
        { id: "D", text: "45" },
      ],
      correctAnswer: "C",
    },
    {
      id: 16,
      text: "Jack is twice as old as Jill. In 6 years, Jack will be 1.5 times Jill's age. How old is Jill now?",
      topic: "Mathematical Reasoning",
      difficulty: "hard",
      options: [
        { id: "A", text: "6" },
        { id: "B", text: "12" },
        { id: "C", text: "18" },
        { id: "D", text: "9" },
      ],
      correctAnswer: "A",
    },
    {
      id: 17,
      text: "A shop reduces a price by 20%, then increases the new price by 20%. Net change in original price?",
      topic: "Mathematical Reasoning",
      difficulty: "medium",
      options: [
        { id: "A", text: "0%" },
        { id: "B", text: "4% decrease" },
        { id: "C", text: "4% increase" },
        { id: "D", text: "2% decrease" },
      ],
      correctAnswer: "B",
    },
    {
      id: 18,
      text: "40 streetlights across North, South, East, West.\nEast+West = North+16 | South+West = North+East | East+South = West+8\nHow many lights in the North?",
      topic: "Mathematical Reasoning",
      difficulty: "hard",
      options: [
        { id: "A", text: "6" },
        { id: "B", text: "8" },
        { id: "C", text: "10" },
        { id: "D", text: "12" },
      ],
      correctAnswer: "B",
    },
    {
      id: 19,
      text: "Cube net: face 1 opposite 6, face 2 opposite 5, face 3 opposite 4. Face 1 on top, face 2 faces you. Which face is on the right?",
      topic: "Spatial Reasoning",
      difficulty: "medium",
      options: [
        { id: "A", text: "Face 3" },
        { id: "B", text: "Face 4" },
        { id: "C", text: "Face 5" },
        { id: "D", text: "Face 6" },
      ],
      correctAnswer: "A",
    },
    {
      id: 20,
      text: "Square paper folded in half (left over right), then again (top over bottom). Hole punched in top-right corner. When fully unfolded, how many holes?",
      topic: "Spatial Reasoning",
      difficulty: "hard",
      options: [
        { id: "A", text: "1" },
        { id: "B", text: "2" },
        { id: "C", text: "4" },
        { id: "D", text: "8" },
      ],
      correctAnswer: "C",
    },
    {
      id: 21,
      text: "3D shape: 6 faces, 12 edges, 8 vertices. What shape?",
      topic: "Spatial Reasoning",
      difficulty: "medium",
      options: [
        { id: "A", text: "Tetrahedron" },
        { id: "B", text: "Cube" },
        { id: "C", text: "Triangular prism" },
        { id: "D", text: "Octahedron" },
      ],
      correctAnswer: "B",
    },
    {
      id: 22,
      text: "4×4×4 cube painted red on all outer faces, then cut into 64 unit cubes. How many unit cubes have exactly 2 red faces?",
      topic: "Spatial Reasoning",
      difficulty: "hard",
      options: [
        { id: "A", text: "24" },
        { id: "B", text: "16" },
        { id: "C", text: "12" },
        { id: "D", text: "8" },
      ],
      correctAnswer: "A",
    },
    {
      id: 23,
      text: "Argument: 'Students who play sports perform better academically because sports teach discipline.' A school bans sports to focus on studies. Which statement most weakens the school's decision?",
      topic: "Critical Reasoning",
      difficulty: "medium",
      options: [
        { id: "A", text: "Sports take time away from studying." },
        { id: "B", text: "Discipline from sports improves academic focus." },
        { id: "C", text: "Many top students do not play sports." },
        { id: "D", text: "Sports are expensive to fund." },
      ],
      correctAnswer: "B",
    },
    {
      id: 24,
      text: "'All technology makes life easier. Smartphones are technology. Therefore, smartphones make life easier.' Main flaw?",
      topic: "Critical Reasoning",
      difficulty: "hard",
      options: [
        { id: "A", text: "Smartphones are not technology." },
        { id: "B", text: "The premise 'all technology makes life easier' is a sweeping, unverified generalisation." },
        { id: "C", text: "Life is already easy without technology." },
        { id: "D", text: "The argument has no flaw." },
      ],
      correctAnswer: "B",
    },
    {
      id: 25,
      text: "A company claims its product is 'preferred by 8 out of 10 dentists'. Survey sampled exactly 10 dentists. Main weakness?",
      topic: "Critical Reasoning",
      difficulty: "medium",
      options: [
        { id: "A", text: "Dentists don't use the product." },
        { id: "B", text: "The sample size is too small to generalise." },
        { id: "C", text: "8 out of 10 is actually low." },
        { id: "D", text: "Dentists may prefer a rival product." },
      ],
      correctAnswer: "B",
    },
    {
      id: 26,
      text: "Country X has more hospitals per capita than Country Y but worse health outcomes. Best explanation?",
      topic: "Critical Reasoning",
      difficulty: "hard",
      options: [
        { id: "A", text: "Country X has better doctors." },
        { id: "B", text: "Country X has a much older and sicker population requiring more hospital care." },
        { id: "C", text: "Country Y spends more on sports." },
        { id: "D", text: "Country X has better roads." },
      ],
      correctAnswer: "B",
    },
    {
      id: 27,
      text: "2, 6, 12, 20, 30, ?",
      topic: "Sequence & Pattern",
      difficulty: "medium",
      options: [
        { id: "A", text: "40" },
        { id: "B", text: "42" },
        { id: "C", text: "44" },
        { id: "D", text: "36" },
      ],
      correctAnswer: "B",
    },
    {
      id: 28,
      text: "1, 1, 2, 3, 5, 8, 13, ?",
      topic: "Sequence & Pattern",
      difficulty: "hard",
      options: [
        { id: "A", text: "18" },
        { id: "B", text: "20" },
        { id: "C", text: "21" },
        { id: "D", text: "24" },
      ],
      correctAnswer: "C",
    },
    {
      id: 29,
      text: "4, 9, 25, ?, 121, 169",
      topic: "Sequence & Pattern",
      difficulty: "medium",
      options: [
        { id: "A", text: "36" },
        { id: "B", text: "49" },
        { id: "C", text: "64" },
        { id: "D", text: "81" },
      ],
      correctAnswer: "B",
    },
    {
      id: 30,
      text: "3, 6, 11, 18, 27, ?",
      topic: "Sequence & Pattern",
      difficulty: "hard",
      options: [
        { id: "A", text: "36" },
        { id: "B", text: "38" },
        { id: "C", text: "40" },
        { id: "D", text: "34" },
      ],
      correctAnswer: "B",
    },
    {
      id: 31,
      text: "A, C, F, J, O, ?",
      topic: "Sequence & Pattern",
      difficulty: "medium",
      options: [
        { id: "A", text: "T" },
        { id: "B", text: "U" },
        { id: "C", text: "V" },
        { id: "D", text: "W" },
      ],
      correctAnswer: "B",
    },
    {
      id: 32,
      text: "Some A are B. All B are C. Which conclusion is definitely true?",
      topic: "Syllogisms",
      difficulty: "medium",
      options: [
        { id: "A", text: "All A are C." },
        { id: "B", text: "Some A are C." },
        { id: "C", text: "No A is C." },
        { id: "D", text: "All C are A." },
      ],
      correctAnswer: "B",
    },
    {
      id: 33,
      text: "No M is N. Some N are P. All P are Q. Definitely true?",
      topic: "Syllogisms",
      difficulty: "hard",
      options: [
        { id: "A", text: "Some Q are not M." },
        { id: "B", text: "All Q are N." },
        { id: "C", text: "No Q is M." },
        { id: "D", text: "Some M are Q." },
      ],
      correctAnswer: "A",
    },
    {
      id: 34,
      text: "All lions are brave. Some brave animals are tigers. No tiger is a lion.\nConclusion?",
      topic: "Syllogisms",
      difficulty: "medium",
      options: [
        { id: "A", text: "Some lions are tigers." },
        { id: "B", text: "All tigers are brave." },
        { id: "C", text: "There exist brave animals that are neither lions nor tigers." },
        { id: "D", text: "No brave animal is a lion." },
      ],
      correctAnswer: "C",
    },
    {
      id: 35,
      text: "1st January 2024 is a Monday. 2024 is a leap year. What day is 1st February 2024?",
      topic: "Calendar & Time",
      difficulty: "medium",
      options: [
        { id: "A", text: "Thursday" },
        { id: "B", text: "Wednesday" },
        { id: "C", text: "Tuesday" },
        { id: "D", text: "Friday" },
      ],
      correctAnswer: "A",
    },
    {
      id: 36,
      text: "A clock shows 3:15. Angle between hour and minute hands?",
      topic: "Calendar & Time",
      difficulty: "hard",
      options: [
        { id: "A", text: "7.5°" },
        { id: "B", text: "0°" },
        { id: "C", text: "15°" },
        { id: "D", text: "22.5°" },
      ],
      correctAnswer: "A",
    },
    {
      id: 37,
      text: "Meeting starts 9:40 AM, lasts 2 hours 50 minutes. When does it end?",
      topic: "Calendar & Time",
      difficulty: "medium",
      options: [
        { id: "A", text: "12:10 PM" },
        { id: "B", text: "12:30 PM" },
        { id: "C", text: "12:00 PM" },
        { id: "D", text: "1:10 PM" },
      ],
      correctAnswer: "B",
    },
    {
      id: 38,
      text: "W, X, Y, Z each like a different sport: cricket, tennis, football, swimming.\nW doesn't like cricket or swimming. X likes tennis. Y doesn't like football. Z likes swimming.\nWhich sport does W like?",
      topic: "Analytical Puzzles",
      difficulty: "hard",
      options: [
        { id: "A", text: "Cricket" },
        { id: "B", text: "Tennis" },
        { id: "C", text: "Football" },
        { id: "D", text: "Swimming" },
      ],
      correctAnswer: "C",
    },
    {
      id: 39,
      text: "Orange = $2. Jack: 1 pineapple + 1 orange + 1 banana = $8. Ben: 1 pineapple + 2 apples = $11.\nLily: 1 apple + 1 orange + 1 banana. How much is Lily's fruit set worth?",
      topic: "Analytical Puzzles",
      difficulty: "hard",
      options: [
        { id: "A", text: "$6" },
        { id: "B", text: "$5" },
        { id: "C", text: "$7" },
        { id: "D", text: "$8" },
      ],
      correctAnswer: "A",
    },
    {
      id: 40,
      text: "Five colleagues A,B,C,D,E sit in a row. A is not at either end. B sits immediately to A's left. D is at one end. C is not next to D. E is at the other end. Order left to right?",
      topic: "Analytical Puzzles",
      difficulty: "hard",
      options: [
        { id: "A", text: "D, B, A, C, E" },
        { id: "B", text: "E, C, B, A, D" },
        { id: "C", text: "D, C, B, A, E" },
        { id: "D", text: "E, B, A, C, D" },
      ],
      correctAnswer: "C",
    },
  ],
};

// ─── READING PASSAGES — stored ONCE, referenced by key ───────────────────────
export const READING_PASSAGES: Record<string, string> = {
  part1: `EXTRACT 1: "The Space Between Stations" (Contemporary Fiction, 2023)
Amara pressed her forehead against the cold glass and watched the familiar terraces of Parramatta dissolve into streaks of amber light. Six months in Sydney, and she still felt like a tourist in her own suburb — as though the city had already written its story and simply forgotten to leave a page for her. Her mother said it would pass, the way jetlag passes: suddenly, without announcement. Amara was not convinced.

At school, she had learned to perform fluency. She laughed one beat after everyone else, timed it by watching their shoulders. She answered questions in class using the intonation she had practised in the bathroom mirror each morning — rising at the end, soft on the consonants, the way the television presenters spoke. Only her English teacher, Ms Osei, ever looked at her as though she were already complete, not a rough draft awaiting revision.

The train lurched, and the girl beside Amara — red-haired, freckled, wearing a hoodie that read "LOCAL" in block letters — glanced across. Amara braced for the question she always braced for: "Where are you actually from?" Instead, the girl held out an earbud. "Do you like Flume?" she asked. And Amara, for the first time in six months, said yes to something she actually meant.

EXTRACT 2: "The New Arrival" (Historical Fiction, set 1956, written 1987)
Konstantinos Papadimitriou stepped off the gangway at Station Pier and stood still while the crowd surged around him. He had expected a greeting — not a ceremony, but something. A sign, perhaps. He saw a man in a grey uniform holding a board that read MIGRATION and followed him without question, because that was what you did when you could not read the rest of the signs.

In the weeks that followed, he worked at a factory in Footscray where the machines were loud enough to make conversation unnecessary. He was grateful for this. When men spoke to him at lunchtime he smiled and nodded and ate his spanakopita quickly, folding the foil so that no one could see what was inside. By October he had learned twelve English words he considered essential: yes, no, sorry, excuse me, good morning, how much, and thank you.

The foreman — a large Scottish man named Barr who smelled of pipe tobacco — stopped beside his station one afternoon and said something long and complicated. Konstantinos understood only the final word: "good". He repeated it back — "good" — and Barr clapped him on the shoulder so hard his teeth knocked together. After that, Konstantinos decided that English, whatever else it was, was a language in which one word could carry the weight of many.`,

  part2: `POEM — "Low Tide at Cronulla" by J. Hartley-Marsh
The water pulls its skirt back from the shore,
as though embarrassed by what lies beneath —
a litter of grey shells, the ocean's floor
exposed and unremarkable as grief.

The children do not notice. They are busy
with the living things — a crab that scuttles
sidewise from their shrieking, in a dizzy
arc of panic through the pooled-up puddles.

My grandmother once said the sea forgets
everything immediately. I think
she meant the tide — how nothing permanent sets
in salt, how even granite learns to sink.

I am standing at the border of two worlds:
the one that stays, the one that is erased.
The sea says nothing. Somewhere, a gull hurls
itself against the wind and is displaced.`,

  part3: `ARTICLE — "Why Cities Are Getting Hotter" (adapted from Year 7 Science Magazine)
If you have ever walked barefoot across a suburban driveway on a summer afternoon, you have already encountered the urban heat island effect. Cities are measurably hotter than the rural land that surrounds them — sometimes by as much as 5°C — and scientists have been studying this phenomenon for nearly two centuries.

The cause is almost entirely architectural. Cities replace grass, trees and soil with concrete, asphalt and glass. Natural surfaces absorb sunlight during the day and release it slowly overnight, but also allow evaporation, which cools the ground. Hard surfaces such as concrete and bitumen, on the other hand, do neither. Without this natural cooling cycle, urban surfaces store heat like giant, slow-burning stoves.

Buildings compound the problem in a second way. Tall structures prevent wind from flowing freely through a city, reducing the natural ventilation that would otherwise carry excess heat away. This tunnel effect, sometimes called the "street canyon" phenomenon, is most severe in cities with very narrow streets and uniform building heights.

As urban temperatures rise, residents use more air conditioning, further increasing energy consumption. Air conditioning itself generates heat as a by-product, meaning that attempts to cool individual buildings can paradoxically warm the city as a whole.

Green roofs — rooftops covered with soil and living plants — can reduce a building's surface temperature by up to 40°C compared with conventional dark roofing materials. Rows of trees planted along streets provide shade and release water vapour, cooling the air. This approach has been trialled successfully in Singapore, Toronto and Stuttgart.

Researchers at the University of New South Wales found that painting just 10% of Sydney's roads and rooftops white could lower the city's average temperature by nearly 2°C. Lighter surfaces reflect more sunlight rather than absorbing it.

Addressing urban heat requires a systemic redesign of how cities are built and managed. Cities that have made the greatest progress — Amsterdam, Melbourne, and Medellín in Colombia — have embedded heat reduction into planning policy, architecture, public transport, and community design simultaneously.`,

  part4: `TEXT A — Blog post: "AI Made Me a Better Cook" (personal lifestyle blog, April 2025)
I genuinely did not expect to become someone who asks a chatbot what to make for dinner. But here we are. I described the sad contents of my fridge — half a zucchini, some leftover rice, a suspiciously old block of halloumi — and within seconds had a coherent recipe. Was it perfect? No. Did I eat it? Absolutely. The thing nobody tells you about AI cooking assistants is that they have no ego. They do not judge you for your fridge. I find that oddly comforting.

TEXT B — School library report: "Understanding Artificial Intelligence" (NSW Dept of Education, 2024)
Artificial intelligence (AI) refers to computer systems designed to perform tasks that normally require human intelligence, such as recognising patterns, making decisions, and generating language. Modern AI tools use a process called machine learning, in which programs improve their performance over time by analysing large quantities of data. AI is now used across a broad range of sectors, including healthcare, transport, education, and entertainment. It is important to note that AI systems reflect the data they are trained on and may therefore reproduce existing biases present in that data.

TEXT C — Online book review: "The Algorithm Will See You Now" by Dr. Priya Shenfield (ReadersCircle, 2025)
Dr. Shenfield's central argument — that AI-driven diagnostic tools are already outperforming radiologists in detecting certain cancers — is both thrilling and deeply unnerving. She is not anti-technology; she is, if anything, a cautious enthusiast. But her chapters on accountability are sobering. When an AI misdiagnoses a patient, who is responsible? The programmer? The hospital? The algorithm itself? The book does not resolve this question, and nor, Shenfield argues, does current medical law.`,
};

// ─── TEST 3: SELECTIVE READING FREE ASSESSMENT ───
export const readingAssessment: QuizTest = {
  id: "reading-assessment-1",
  title: "Selective Reading Free Assessment",
  subtitle: "38 Questions | 45 Minutes | Multi-Text & Poetry",
  totalQuestions: 38,
  totalMarks: 38,
  durationMinutes: 45,
  bundle: "Selective Reading Free Assessment",
  questions: [
    // PART 1 (Q1-Q14) — passageKey: "part1"
    { id: 1, passageKey: "part1", text: 'Q1. In Extract 1, "perform fluency" most likely suggests Amara is:', topic: "Adolescent Fiction & Historical Comparison", difficulty: "medium", options: [{ id: "A", text: "Genuinely adapting to Australian speech patterns through careful study." }, { id: "B", text: "Deliberately concealing her true linguistic identity to appear to belong." }, { id: "C", text: "Being tutored by Ms Osei in how to speak correctly in class." }, { id: "D", text: "Struggling with a speech impediment she has not told her mother about." }], correctAnswer: "B" },
    { id: 2, passageKey: "part1", text: "Q2. The simile comparing Amara's displacement to jetlag primarily suggests her mother believes:", topic: "Adolescent Fiction & Historical Comparison", difficulty: "medium", options: [{ id: "A", text: "Amara is physically unwell and needs a doctor." }, { id: "B", text: "The feeling of not belonging will eventually fade on its own." }, { id: "C", text: "Moving overseas was a mistake the family should reverse." }, { id: "D", text: "Amara is exaggerating her discomfort for attention." }], correctAnswer: "B" },
    { id: 3, passageKey: "part1", text: 'Q3. "The city had already written its story and simply forgotten to leave a page for her" uses:', topic: "Adolescent Fiction & Historical Comparison", difficulty: "medium", options: [{ id: "A", text: "Simile" }, { id: "B", text: "Onomatopoeia" }, { id: "C", text: "Extended metaphor" }, { id: "D", text: "Hyperbole" }], correctAnswer: "C" },
    { id: 4, passageKey: "part1", text: 'Q4. Why does Amara describe Ms Osei as looking at her "as though she were already complete, not a rough draft awaiting revision"?', topic: "Adolescent Fiction & Historical Comparison", difficulty: "hard", options: [{ id: "A", text: "Ms Osei is a professional editor who values writing." }, { id: "B", text: "Ms Osei alone treats Amara as a fully-formed person, not a work-in-progress." }, { id: "C", text: "Amara is hoping Ms Osei will correct her grammar mistakes." }, { id: "D", text: "Ms Osei disapproves of Amara's accent." }], correctAnswer: "B" },
    { id: 5, passageKey: "part1", text: "Q5. The girl offering Amara an earbud is significant because it:", topic: "Adolescent Fiction & Historical Comparison", difficulty: "medium", options: [{ id: "A", text: "Shows Australian teenagers are friendlier than Amara expected." }, { id: "B", text: "Represents the first moment of genuine, unperformed connection Amara experiences." }, { id: "C", text: "Proves music is a universal language." }, { id: "D", text: "Interrupts Amara's private thoughts and annoys her." }], correctAnswer: "B" },
    { id: 6, passageKey: "part1", text: 'Q6. Konstantinos "folded the foil so that no one could see what was inside" primarily reveals:', topic: "Adolescent Fiction & Historical Comparison", difficulty: "medium", options: [{ id: "A", text: "His poverty and need to preserve food." }, { id: "B", text: "His fear that food might be stolen." }, { id: "C", text: "His desire to hide cultural markers that might invite unwanted attention." }, { id: "D", text: "His embarrassment about poor cooking skills." }], correctAnswer: "C" },
    { id: 7, passageKey: "part1", text: "Q7. Konstantinos choosing only twelve English words by October most likely shows:", topic: "Adolescent Fiction & Historical Comparison", difficulty: "medium", options: [{ id: "A", text: "He had no aptitude for language learning." }, { id: "B", text: "He was selective and pragmatic, focusing on words of immediate practical use." }, { id: "C", text: "Factory workers prevented him from learning more." }, { id: "D", text: "He expected to return to Greece." }], correctAnswer: "B" },
    { id: 8, passageKey: "part1", text: 'Q8. "Essential" in describing the twelve English words suggests:', topic: "Adolescent Fiction & Historical Comparison", difficulty: "easy", options: [{ id: "A", text: "They were the most difficult words." }, { id: "B", text: "They were chosen to keep him safe." }, { id: "C", text: "They were the minimum required to function with dignity in his new environment." }, { id: "D", text: "They were assigned by his employer." }], correctAnswer: "C" },
    { id: 9, passageKey: "part1", text: 'Q9. Konstantinos\'s conclusion that English is "a language in which one word can carry the weight of many" reveals his:', topic: "Adolescent Fiction & Historical Comparison", difficulty: "hard", options: [{ id: "A", text: "Frustration that English is too imprecise." }, { id: "B", text: "Growing philosophical appreciation for language as a tool of human connection." }, { id: "C", text: "Decision to stop learning additional vocabulary." }, { id: "D", text: "Regret that he did not study English before emigrating." }], correctAnswer: "B" },
    { id: 10, passageKey: "part1", text: "Q10. How does the ending of Extract 2 differ in tone from Extract 1?", topic: "Adolescent Fiction & Historical Comparison", difficulty: "hard", options: [{ id: "A", text: "Extract 1 ends with cautious optimism through an unexpected human gesture; Extract 2 ends with quiet philosophical reflection." }, { id: "B", text: "Extract 1 ends with despair; Extract 2 with humour." }, { id: "C", text: "Both end with identical tones of quiet triumph." }, { id: "D", text: "Extract 2 ends with bitterness; Extract 1 with nostalgia." }], correctAnswer: "A" },
    { id: 11, passageKey: "part1", text: "Q11. Which narrative technique is used in BOTH extracts?", topic: "Adolescent Fiction & Historical Comparison", difficulty: "medium", options: [{ id: "A", text: "First-person confessional narration." }, { id: "B", text: "Close third-person narration that reveals the character's inner thoughts." }, { id: "C", text: "Second-person narration addressing the reader directly." }, { id: "D", text: "Omniscient narrator who comments from a distance." }], correctAnswer: "B" },
    { id: 12, passageKey: "part1", text: "Q12. Most significant difference in HOW the two extracts show adjustment to a new environment:", topic: "Adolescent Fiction & Historical Comparison", difficulty: "hard", options: [{ id: "A", text: "Extract 1 focuses on emotional and social performance; Extract 2 on pragmatic survival strategies." }, { id: "B", text: "Extract 1 uses dialogue; Extract 2 uses description only." }, { id: "C", text: "Extract 1 is set in a rural area; Extract 2 in a city." }, { id: "D", text: "Extract 2 shows successful integration; Extract 1 shows complete failure." }], correctAnswer: "A" },
    { id: 13, passageKey: "part1", text: "Q13. Theme common to BOTH extracts:", topic: "Adolescent Fiction & Historical Comparison", difficulty: "medium", options: [{ id: "A", text: "Immigration inevitably leads to cultural erasure." }, { id: "B", text: "Language is the only barrier to meaningful connection." }, { id: "C", text: "Small, unexpected moments of acceptance can ease the experience of displacement." }, { id: "D", text: "Schools and workplaces are equally effective for integration." }], correctAnswer: "C" },
    { id: 14, passageKey: "part1", text: '"The crowd surged around him" conveys a sense of:', topic: "Adolescent Fiction & Historical Comparison", difficulty: "easy", options: [{ id: "A", text: "Slow and orderly movement." }, { id: "B", text: "Powerful, overwhelming movement the character cannot control." }, { id: "C", text: "Joyful celebration from other migrants." }, { id: "D", text: "Deliberate hostility toward Konstantinos." }], correctAnswer: "B" },
    // PART 2 (Q15-Q24) — passageKey: "part2"
    { id: 15, passageKey: "part2", text: 'Q15. "Exposed and unremarkable as grief" is best described as:', topic: "Poetry", difficulty: "easy", options: [{ id: "A", text: "A simile suggesting both the ocean floor and grief are commonly overlooked despite their significance." }, { id: "B", text: "A metaphor comparing grief to a geological formation." }, { id: "C", text: "Personification of the ocean experiencing human emotions." }, { id: "D", text: "Hyperbole exaggerating the poet's sadness." }], correctAnswer: "A" },
    { id: 16, passageKey: "part2", text: 'Q16. "The water pulls its skirt back from the shore" uses personification to suggest the ocean is:', topic: "Poetry", difficulty: "medium", options: [{ id: "A", text: "Aggressive and dangerous." }, { id: "B", text: "Modest or self-conscious about what it reveals." }, { id: "C", text: "Controlled by a powerful external force." }, { id: "D", text: "Retreating in fear from the children." }], correctAnswer: "B" },
    { id: 17, passageKey: "part2", text: "Q17. Why does the poet contrast the children's behaviour with the speaker's mood?", topic: "Poetry", difficulty: "medium", options: [{ id: "A", text: "To show children are careless near water." }, { id: "B", text: "To highlight how youth and age perceive the same scene through entirely different emotional filters." }, { id: "C", text: "To argue nature education should begin in early childhood." }, { id: "D", text: "To suggest the speaker envies children for their energy." }], correctAnswer: "B" },
    { id: 18, passageKey: "part2", text: 'Q18. The crab moving in "a dizzy arc of panic" most likely functions as:', topic: "Poetry", difficulty: "medium", options: [{ id: "A", text: "Comic relief to lighten the tone." }, { id: "B", text: "A symbol of the speaker's own sense of displacement and loss of control." }, { id: "C", text: "Evidence the beach is unsafe for children." }, { id: "D", text: "A literal observation with no broader symbolic meaning." }], correctAnswer: "B" },
    { id: 19, passageKey: "part2", text: 'Q19. The grandmother\'s observation that "the sea forgets everything immediately" is introduced to:', topic: "Poetry", difficulty: "medium", options: [{ id: "A", text: "Provide factual information about tides." }, { id: "B", text: "Contrast the grandmother's science with the speaker's emotion." }, { id: "C", text: "Introduce a personal memory that deepens the poem's meditation on impermanence." }, { id: "D", text: "Argue that forgetting is a positive response to loss." }], correctAnswer: "C" },
    { id: 20, passageKey: "part2", text: 'Q20. "How even granite learns to sink" conveys:', topic: "Poetry", difficulty: "hard", options: [{ id: "A", text: "That even the hardest and most permanent things are eventually worn away or changed." }, { id: "B", text: "That granite is the most interesting geological material on beaches." }, { id: "C", text: "That the speaker has studied geology." }, { id: "D", text: "That the ocean can destroy solid rock instantly." }], correctAnswer: "A" },
    { id: 21, passageKey: "part2", text: 'Q21. The image of the gull hurling "itself against the wind" most closely mirrors:', topic: "Poetry", difficulty: "hard", options: [{ id: "A", text: "The speaker's sense of futile struggle against circumstances they cannot change." }, { id: "B", text: "The physical difficulty of standing on an exposed beach." }, { id: "C", text: "The children's energetic play in stanza 2." }, { id: "D", text: "The grandmother's belief that the sea forgets everything." }], correctAnswer: "A" },
    { id: 22, passageKey: "part2", text: '"I am standing at the border of two worlds" is best interpreted as:', topic: "Poetry", difficulty: "easy", options: [{ id: "A", text: "Literally standing between ocean and land." }, { id: "B", text: "Suspended between past memory and present reality, or between youth and age." }, { id: "C", text: "Travelling between two countries at time of writing." }, { id: "D", text: "Undecided about whether to enter the water." }], correctAnswer: "B" },
    { id: 23, passageKey: "part2", text: "Q23. Dominant mood of the poem overall:", topic: "Poetry", difficulty: "medium", options: [{ id: "A", text: "Joyful and celebratory." }, { id: "B", text: "Angry and bitter." }, { id: "C", text: "Contemplative and melancholic, exploring loss and impermanence." }, { id: "D", text: "Detached and scientific." }], correctAnswer: "C" },
    { id: 24, passageKey: "part2", text: "Q24. The ABAB rhyme scheme contributes to meaning by:", topic: "Poetry", difficulty: "medium", options: [{ id: "A", text: "Creating a sense of chaos mirroring the speaker's state." }, { id: "B", text: "Providing an ordered, recurring pattern that contrasts with the poem's theme of constant change." }, { id: "C", text: "Making the poem easier to memorise." }, { id: "D", text: "Signalling the poem belongs to Australian bush poetry tradition." }], correctAnswer: "B" },
    // PART 3 (Q25-Q35) — passageKey: "part3"
    { id: 25, passageKey: "part3", text: "Q25. Primary cause of urban heat island effect identified in the article:", topic: "Factual Text", difficulty: "easy", options: [{ id: "A", text: "Population density and body heat." }, { id: "B", text: "Replacement of natural surfaces with materials that cannot cool through evaporation." }, { id: "C", text: "Industrial activity and factory emissions." }, { id: "D", text: "Gradual warming due to greenhouse gases." }], correctAnswer: "B" },
    { id: 26, passageKey: "part3", text: 'Q26. "Giant, slow-burning stoves" is an example of:', topic: "Factual Text", difficulty: "easy", options: [{ id: "A", text: "A simile comparing urban surfaces to kitchen appliances." }, { id: "B", text: "A metaphor conveying how urban surfaces retain and release heat." }, { id: "C", text: "Personification giving urban materials human-like qualities." }, { id: "D", text: "An analogy drawn from a scientific report." }], correctAnswer: "B" },
    { id: 27, passageKey: "part3", text: '"Paradoxically warm the city as a whole" means:', topic: "Factual Text", difficulty: "medium", options: [{ id: "A", text: "Air conditioners are inefficient and don't actually cool buildings." }, { id: "B", text: "Energy used by air conditioners increases global warming long-term." }, { id: "C", text: "Heat expelled by air conditioners adds to outdoor temperature even while cooling interiors." }, { id: "D", text: "Cities using more AC are in hotter climates to begin with." }], correctAnswer: "C" },
    { id: 28, passageKey: "part3", text: 'Q28. "Compound" as used in "Buildings compound the problem" is closest in meaning to:', topic: "Factual Text", difficulty: "medium", options: [{ id: "A", text: "Simplify" }, { id: "B", text: "Describe" }, { id: "C", text: "Intensify" }, { id: "D", text: "Isolate" }], correctAnswer: "C" },
    { id: 29, passageKey: "part3", text: "Q29. Most accurate inference about green roofs:", topic: "Factual Text", difficulty: "hard", options: [{ id: "A", text: "Proven solution that will eliminate urban heat in all cities within 10 years." }, { id: "B", text: "They address the problem at building scale and can contribute to a wider solution." }, { id: "C", text: "Only effective in tropical cities like Singapore." }, { id: "D", text: "They work by reflecting sunlight using light-coloured soil." }], correctAnswer: "B" },
    { id: 30, passageKey: "part3", text: "Q30. According to UNSW research, painting 10% of Sydney's roads and rooftops white would:", topic: "Factual Text", difficulty: "hard", options: [{ id: "A", text: "Reduce temperature by nearly 5°C." }, { id: "B", text: "Eliminate need for AC in residential buildings." }, { id: "C", text: "Lower the city's average temperature by nearly 2°C." }, { id: "D", text: "Reduce energy consumption by approximately 10%." }], correctAnswer: "C" },
    { id: 31, passageKey: "part3", text: "Q31. Examples of Amsterdam, Melbourne, and Medellín serve to:", topic: "Factual Text", difficulty: "medium", options: [{ id: "A", text: "Suggest only large or wealthy cities can afford solutions." }, { id: "B", text: "Demonstrate internationally coordinated policy is required." }, { id: "C", text: "Provide evidence that a multifaceted integrated approach has produced real results in different cities." }, { id: "D", text: "Argue Australian cities should copy European and South American planning exactly." }], correctAnswer: "C" },
    { id: 32, passageKey: "part3", text: 'Q32. "Street canyon phenomenon" most likely refers to:', topic: "Factual Text", difficulty: "medium", options: [{ id: "A", text: "Flooding caused by heavy rain in narrow streets." }, { id: "B", text: "A situation in which tall buildings on narrow streets block wind and trap heat." }, { id: "C", text: "Visual effect of looking up at tall buildings." }, { id: "D", text: "Noise pollution created by traffic." }], correctAnswer: "B" },
    { id: 33, passageKey: "part3", text: "Q33. Author's primary purpose:", topic: "Factual Text", difficulty: "easy", options: [{ id: "A", text: "To persuade governments to ban air conditioning." }, { id: "B", text: "To entertain young readers with surprising facts." }, { id: "C", text: "To inform readers about causes of, and solutions to, the urban heat island effect." }, { id: "D", text: "To argue all cities should be rebuilt from scratch." }], correctAnswer: "C" },
    { id: 34, passageKey: "part3", text: "Q34. Text structure of the article:", topic: "Factual Text", difficulty: "medium", options: [{ id: "A", text: "Chronological order." }, { id: "B", text: "Problem-cause-solution structure." }, { id: "C", text: "Compare-and-contrast." }, { id: "D", text: "Narrative structure." }], correctAnswer: "B" },
    { id: 35, passageKey: "part3", text: "Q35. The opening sentence is designed to:", topic: "Factual Text", difficulty: "easy", options: [{ id: "A", text: "Provide precise scientific measurement of surface temperature." }, { id: "B", text: "Warn readers about dangers of walking without shoes." }, { id: "C", text: "Immediately connect a universal personal experience to the article's scientific topic." }, { id: "D", text: "Establish the article is written specifically for Australian readers." }], correctAnswer: "C" },
    // PART 4 (Q36-Q38) — passageKey: "part4"
    { id: 36, passageKey: "part4", text: "Q36. TEXT A uses which tone to engage its reader?", topic: "Multi-Text Analysis", difficulty: "medium", options: [{ id: "A", text: "Formal and authoritative, citing research to support its claims." }, { id: "B", text: "Conversational and self-deprecating, using humour to make its point." }, { id: "C", text: "Analytical and detached, evaluating AI tools from a distance." }, { id: "D", text: "Alarmed and urgent, warning readers about the dangers of AI." }], correctAnswer: "B" },
    { id: 37, passageKey: "part4", text: 'Q37. In TEXT A, "the thing nobody tells you about AI cooking assistants is that they have no ego" suggests the author values:', topic: "Multi-Text Analysis", difficulty: "medium", options: [{ id: "A", text: "That the AI provides nutritionally balanced meals." }, { id: "B", text: "That the AI never judges or criticises the user's choices." }, { id: "C", text: "That the AI can replace a professional chef." }, { id: "D", text: "That the AI works faster than any human cook." }], correctAnswer: "B" },
    { id: 38, passageKey: "part4", text: "Q38. TEXT B differs from the other texts primarily because it:", topic: "Multi-Text Analysis", difficulty: "easy", options: [{ id: "A", text: "Expresses a strong personal opinion about whether AI is harmful." }, { id: "B", text: "Focuses only on the use of AI in healthcare settings." }, { id: "C", text: "Presents factual, objective information without a personal viewpoint." }, { id: "D", text: "Was written by a student rather than a professional author." }], correctAnswer: "C" },
  ],
};

// ─── TEST 4: WRITING SKILLS FREE ASSESSMENT ───
export const writingAssessment: QuizTest = {
  id: "writing-assessment-1",
  title: "Writing Skills Free Assessment",
  subtitle: "1 Question | 30 Minutes | Free-Response Prompt",
  totalQuestions: 1,
  totalMarks: 20,
  durationMinutes: 30,
  bundle: "Writing Skills Free Assessment",
  type: "writing",
  questions: [
    {
      id: 1,
      text: "Write a short narrative describing a time when you had to overcome a challenge. Focus on how you felt and what you learned from the experience.",
      topic: "Creative Writing",
      difficulty: "medium",
      options: [],
      correctAnswer: "",
    },
  ],
};

export const quizTests: Record<string, QuizTest> = {
  [mockTest.id]: mockTest,
  [mathAssessment.id]: mathAssessment,
  [writingAssessment.id]: writingAssessment,
  [readingAssessment.id]: readingAssessment,
};

export function getQuizTest(testId: string): QuizTest {
  return quizTests[testId] ?? mockTest;
}























// export type QuizOption = { id: string; text: string };
// export type QuizQuestion = {
//   id: number;
//   text: string;
//   topic: string;
//   difficulty: string;
//   options: QuizOption[];
//   correctAnswer: string;
// };
// export type QuizTest = {
//   id: string;
//   title: string;
//   subtitle: string;
//   totalQuestions: number;
//   totalMarks: number;
//   durationMinutes: number;
//   bundle: string;
//   questions: QuizQuestion[];
//   type?: "mcq" | "writing";
// };

// // ─── TEST 1: MATHEMATICAL REASONING FREE ASSESSMENT ───
// export const mathAssessment: QuizTest = {
//   id: "mathematics-assessment-1",
//   title: "Mathematical Reasoning Free Assessment",
//   subtitle: "35 Questions | 40 Minutes | No Calculator",
//   totalQuestions: 35,
//   totalMarks: 35,
//   durationMinutes: 40,
//   bundle: "Mathematical Reasoning Free Assessment",
//   questions: [
//     {
//       id: 1,
//       text: "A box of 24 chocolates is shared equally among 6 friends. Each friend then gives 2 chocolates to their younger sibling. How many chocolates does each friend have left?",
//       topic: "Number Sense & Algebra",
//       difficulty: "easy",
//       options: [
//         { id: "A", text: "2" },
//         { id: "B", text: "4" },
//         { id: "C", text: "6" },
//         { id: "D", text: "3" },
//       ],
//       correctAnswer: "A",
//     },
//     {
//       id: 2,
//       text: "A shirt costs $60. It is first discounted by 25%, then a further 10% is taken off the reduced price. What is the final price?",
//       topic: "Number Sense & Algebra",
//       difficulty: "medium",
//       options: [
//         { id: "A", text: "$37.50" },
//         { id: "B", text: "$40.50" },
//         { id: "C", text: "$39.00" },
//         { id: "D", text: "$36.00" },
//       ],
//       correctAnswer: "B",
//     },
//     {
//       id: 3,
//       text: "A recipe uses 3 cups of flour for every 2 cups of sugar. If a baker wants to use 15 cups of flour, how many cups of sugar does she need?",
//       topic: "Number Sense & Algebra",
//       difficulty: "medium",
//       options: [
//         { id: "A", text: "8" },
//         { id: "B", text: "9" },
//         { id: "C", text: "10" },
//         { id: "D", text: "12" },
//       ],
//       correctAnswer: "C",
//     },
//     {
//       id: 4,
//       text: "Emma is 3 times as old as her brother Tom. In 8 years, Emma will be twice as old as Tom. How old is Tom now?",
//       topic: "Number Sense & Algebra",
//       difficulty: "hard",
//       options: [
//         { id: "A", text: "4" },
//         { id: "B", text: "6" },
//         { id: "C", text: "8" },
//         { id: "D", text: "10" },
//       ],
//       correctAnswer: "C",
//     },
//     {
//       id: 5,
//       text: "A number gives a remainder of 4 when divided by 7, and a remainder of 2 when divided by 5. What is the smallest such positive integer?",
//       topic: "Number Sense & Algebra",
//       difficulty: "hard",
//       options: [
//         { id: "A", text: "11" },
//         { id: "B", text: "32" },
//         { id: "C", text: "39" },
//         { id: "D", text: "18" },
//       ],
//       correctAnswer: "B",
//     },
//     {
//       id: 6,
//       text: "Jack and Jill share $180 in the ratio 4:5. How much more does Jill receive than Jack?",
//       topic: "Number Sense & Algebra",
//       difficulty: "medium",
//       options: [
//         { id: "A", text: "$18" },
//         { id: "B", text: "$20" },
//         { id: "C", text: "$24" },
//         { id: "D", text: "$30" },
//       ],
//       correctAnswer: "B",
//     },
//     {
//       id: 7,
//       text: "A store sells apples for $0.80 each and oranges for $1.20 each. Maya spends exactly $9.60 buying a total of 10 fruits. How many apples did she buy?",
//       topic: "Number Sense & Algebra",
//       difficulty: "hard",
//       options: [
//         { id: "A", text: "4" },
//         { id: "B", text: "5" },
//         { id: "C", text: "6" },
//         { id: "D", text: "7" },
//       ],
//       correctAnswer: "C",
//     },
//     {
//       id: 8,
//       text: "A school has 240 students. 15% of them participate in the chess club. How many students are in the chess club?",
//       topic: "Number Sense & Algebra",
//       difficulty: "easy",
//       options: [
//         { id: "A", text: "24" },
//         { id: "B", text: "30" },
//         { id: "C", text: "36" },
//         { id: "D", text: "40" },
//       ],
//       correctAnswer: "C",
//     },
//     {
//       id: 9,
//       text: "The sum of three consecutive even numbers is 78. What is the largest of the three numbers?",
//       topic: "Number Sense & Algebra",
//       difficulty: "hard",
//       options: [
//         { id: "A", text: "24" },
//         { id: "B", text: "26" },
//         { id: "C", text: "28" },
//         { id: "D", text: "30" },
//       ],
//       correctAnswer: "C",
//     },
//     {
//       id: 10,
//       text: "A store marks up the cost price of a jacket by 40% to set the selling price. During a sale, the selling price is discounted by 20%. If the final sale price is $67.20, what was the original cost price?",
//       topic: "Number Sense & Algebra",
//       difficulty: "challenging",
//       options: [
//         { id: "A", text: "$55.00" },
//         { id: "B", text: "$58.00" },
//         { id: "C", text: "$60.00" },
//         { id: "D", text: "$64.00" },
//       ],
//       correctAnswer: "C",
//     },
//     {
//       id: 11,
//       text: "A train departs at 08:45 and arrives at its destination at 11:20. How long is the journey?",
//       topic: "Measurement",
//       difficulty: "easy",
//       options: [
//         { id: "A", text: "2 hr 25 min" },
//         { id: "B", text: "2 hr 35 min" },
//         { id: "C", text: "2 hr 45 min" },
//         { id: "D", text: "3 hr 5 min" },
//       ],
//       correctAnswer: "B",
//     },
//     {
//       id: 12,
//       text: "Two cyclists start from the same point at the same time, travelling in opposite directions. Cyclist A travels at 18 km/h and Cyclist B at 22 km/h. How far apart are they after 1.5 hours?",
//       topic: "Measurement",
//       difficulty: "medium",
//       options: [
//         { id: "A", text: "54 km" },
//         { id: "B", text: "60 km" },
//         { id: "C", text: "66 km" },
//         { id: "D", text: "72 km" },
//       ],
//       correctAnswer: "B",
//     },
//     {
//       id: 13,
//       text: "A rectangular garden has a perimeter of 56 m. Its length is 6 m more than its width. What is the area of the garden?",
//       topic: "Measurement",
//       difficulty: "medium",
//       options: [
//         { id: "A", text: "160 m²" },
//         { id: "B", text: "175 m²" },
//         { id: "C", text: "187 m²" },
//         { id: "D", text: "190 m²" },
//       ],
//       correctAnswer: "C",
//     },
//     {
//       id: 14,
//       text: "A car travels from City A to City B at 60 km/h and returns along the same route at 40 km/h. What is the average speed for the entire round trip?",
//       topic: "Measurement",
//       difficulty: "hard",
//       options: [
//         { id: "A", text: "48 km/h" },
//         { id: "B", text: "50 km/h" },
//         { id: "C", text: "52 km/h" },
//         { id: "D", text: "54 km/h" },
//       ],
//       correctAnswer: "A",
//     },
//     {
//       id: 15,
//       text: "A water tank is three-quarters full and contains 270 litres. How many more litres are needed to fill the tank completely?",
//       topic: "Measurement",
//       difficulty: "medium",
//       options: [
//         { id: "A", text: "60 L" },
//         { id: "B", text: "80 L" },
//         { id: "C", text: "90 L" },
//         { id: "D", text: "100 L" },
//       ],
//       correctAnswer: "C",
//     },
//     {
//       id: 16,
//       text: "A rectangular floor is 8 m long and 5 m wide. Square tiles of side 50 cm are used to cover the floor. How many tiles are needed?",
//       topic: "Measurement",
//       difficulty: "hard",
//       options: [
//         { id: "A", text: "120" },
//         { id: "B", text: "140" },
//         { id: "C", text: "160" },
//         { id: "D", text: "180" },
//       ],
//       correctAnswer: "C",
//     },
//     {
//       id: 17,
//       text: "Pipe A fills a tank in 6 hours. Pipe B fills the same tank in 3 hours. If both pipes are open at the same time, how long will it take to fill the tank?",
//       topic: "Measurement",
//       difficulty: "easy",
//       options: [
//         { id: "A", text: "1.5 hours" },
//         { id: "B", text: "2 hours" },
//         { id: "C", text: "2.5 hours" },
//         { id: "D", text: "4 hours" },
//       ],
//       correctAnswer: "B",
//     },
//     {
//       id: 18,
//       text: "A rectangular piece of wire is 18 cm long and 12 cm wide. The wire is straightened and then bent into a square. What is the side length of the square?",
//       topic: "Measurement",
//       difficulty: "challenging",
//       options: [
//         { id: "A", text: "12 cm" },
//         { id: "B", text: "15 cm" },
//         { id: "C", text: "16 cm" },
//         { id: "D", text: "18 cm" },
//       ],
//       correctAnswer: "B",
//     },
//     {
//       id: 19,
//       text: "The three angles of a triangle are in the ratio 2:3:4. What is the size of the largest angle?",
//       topic: "Geometry & Spatial Mathematics",
//       difficulty: "medium",
//       options: [
//         { id: "A", text: "60°" },
//         { id: "B", text: "72°" },
//         { id: "C", text: "80°" },
//         { id: "D", text: "90°" },
//       ],
//       correctAnswer: "C",
//     },
//     {
//       id: 20,
//       text: "A rectangle has vertices at coordinates (1,1), (5,1), (5,4), and (1,4). What is its perimeter?",
//       topic: "Geometry & Spatial Mathematics",
//       difficulty: "easy",
//       options: [
//         { id: "A", text: "12" },
//         { id: "B", text: "14" },
//         { id: "C", text: "16" },
//         { id: "D", text: "20" },
//       ],
//       correctAnswer: "B",
//     },
//     {
//       id: 21,
//       text: "What is the angle between the hour hand and the minute hand on a clock showing 4:20?",
//       topic: "Geometry & Spatial Mathematics",
//       difficulty: "hard",
//       options: [
//         { id: "A", text: "5°" },
//         { id: "B", text: "10°" },
//         { id: "C", text: "15°" },
//         { id: "D", text: "20°" },
//       ],
//       correctAnswer: "B",
//     },
//     {
//       id: 22,
//       text: "A cube has a total surface area of 216 cm². What is the volume of the cube?",
//       topic: "Geometry & Spatial Mathematics",
//       difficulty: "medium",
//       options: [
//         { id: "A", text: "125 cm³" },
//         { id: "B", text: "216 cm³" },
//         { id: "C", text: "343 cm³" },
//         { id: "D", text: "512 cm³" },
//       ],
//       correctAnswer: "B",
//     },
//     {
//       id: 23,
//       text: "Two straight lines intersect. One of the angles formed is (3x + 15)° and the angle adjacent to it is (2x + 5)°. What is the value of x?",
//       topic: "Geometry & Spatial Mathematics",
//       difficulty: "challenging",
//       options: [
//         { id: "A", text: "28" },
//         { id: "B", text: "30" },
//         { id: "C", text: "32" },
//         { id: "D", text: "35" },
//       ],
//       correctAnswer: "C",
//     },
//     {
//       id: 24,
//       text: "A semicircle is drawn on the hypotenuse of a right-angled triangle whose two shorter sides are 6 cm and 8 cm. What is the area of the semicircle? (Use π = 3.14)",
//       topic: "Geometry & Spatial Mathematics",
//       difficulty: "hard",
//       options: [
//         { id: "A", text: "39.25 cm²" },
//         { id: "B", text: "78.50 cm²" },
//         { id: "C", text: "28.26 cm²" },
//         { id: "D", text: "56.52 cm²" },
//       ],
//       correctAnswer: "A",
//     },
//     {
//       id: 25,
//       text: "The mean of five numbers is 14. Four of the numbers are 10, 12, 16, and 18. What is the fifth number?",
//       topic: "Data, Statistics & Probability",
//       difficulty: "easy",
//       options: [
//         { id: "A", text: "12" },
//         { id: "B", text: "14" },
//         { id: "C", text: "16" },
//         { id: "D", text: "18" },
//       ],
//       correctAnswer: "B",
//     },
//     {
//       id: 26,
//       text: "A bag contains 5 red, 3 blue, and 2 green marbles. One marble is drawn at random. What is the probability that it is NOT red?",
//       topic: "Data, Statistics & Probability",
//       difficulty: "medium",
//       options: [
//         { id: "A", text: "1/2" },
//         { id: "B", text: "3/5" },
//         { id: "C", text: "2/5" },
//         { id: "D", text: "1/5" },
//       ],
//       correctAnswer: "A",
//     },
//     {
//       id: 27,
//       text: "In a class of 30 students, the mean test score is 72. The 10 boys in the class had a mean score of 60. What was the mean score of the 20 girls?",
//       topic: "Data, Statistics & Probability",
//       difficulty: "hard",
//       options: [
//         { id: "A", text: "74" },
//         { id: "B", text: "76" },
//         { id: "C", text: "78" },
//         { id: "D", text: "80" },
//       ],
//       correctAnswer: "C",
//     },
//     {
//       id: 28,
//       text: "A spinner is divided into 8 equal sections numbered 1 to 8. What is the probability of spinning an even number greater than 4?",
//       topic: "Data, Statistics & Probability",
//       difficulty: "medium",
//       options: [
//         { id: "A", text: "1/4" },
//         { id: "B", text: "3/8" },
//         { id: "C", text: "1/2" },
//         { id: "D", text: "5/8" },
//       ],
//       correctAnswer: "A",
//     },
//     {
//       id: 29,
//       text: "Seven data values are: 8, 11, x, 15, 19, y, and 28. When arranged in ascending order, the median is 15. The mean of all seven values is also 15. What is the value of x + y?",
//       topic: "Data, Statistics & Probability",
//       difficulty: "hard",
//       options: [
//         { id: "A", text: "20" },
//         { id: "B", text: "22" },
//         { id: "C", text: "24" },
//         { id: "D", text: "26" },
//       ],
//       correctAnswer: "C",
//     },
//     {
//       id: 30,
//       text: "Two fair dice are rolled simultaneously. What is the probability that the sum of the two numbers shown is greater than 9?",
//       topic: "Data, Statistics & Probability",
//       difficulty: "challenging",
//       options: [
//         { id: "A", text: "1/6" },
//         { id: "B", text: "1/4" },
//         { id: "C", text: "1/9" },
//         { id: "D", text: "1/12" },
//       ],
//       correctAnswer: "A",
//     },
//     {
//       id: 31,
//       text: "What is the next number in the sequence? 5, 11, 19, 29, 41, __",
//       topic: "Numerical Sequences & Patterns",
//       difficulty: "easy",
//       options: [
//         { id: "A", text: "53" },
//         { id: "B", text: "55" },
//         { id: "C", text: "57" },
//         { id: "D", text: "59" },
//       ],
//       correctAnswer: "B",
//     },
//     {
//       id: 32,
//       text: "Find the missing term in the sequence: 3, 6, 12, __, 48, 96",
//       topic: "Numerical Sequences & Patterns",
//       difficulty: "medium",
//       options: [
//         { id: "A", text: "20" },
//         { id: "B", text: "24" },
//         { id: "C", text: "28" },
//         { id: "D", text: "32" },
//       ],
//       correctAnswer: "B",
//     },
//     {
//       id: 33,
//       text: "In a sequence, each term after the first two is the sum of the two terms before it. The 4th term is 11 and the 6th term is 29. What is the 1st term?",
//       topic: "Numerical Sequences & Patterns",
//       difficulty: "hard",
//       options: [
//         { id: "A", text: "2" },
//         { id: "B", text: "3" },
//         { id: "C", text: "4" },
//         { id: "D", text: "5" },
//       ],
//       correctAnswer: "B",
//     },
//     {
//       id: 34,
//       text: "A pattern of squares is built row by row: Row 1 has 1 square, Row 2 has 3 squares, Row 3 has 5 squares, and so on. How many squares are in Row 20?",
//       topic: "Numerical Sequences & Patterns",
//       difficulty: "challenging",
//       options: [
//         { id: "A", text: "37" },
//         { id: "B", text: "39" },
//         { id: "C", text: "40" },
//         { id: "D", text: "41" },
//       ],
//       correctAnswer: "B",
//     },
//     {
//       id: 35,
//       text: "The first term of an arithmetic sequence is 7 and the common difference is 4. What is the sum of the first 10 terms?",
//       topic: "Numerical Sequences & Patterns",
//       difficulty: "hard",
//       options: [
//         { id: "A", text: "214" },
//         { id: "B", text: "250" },
//         { id: "C", text: "256" },
//         { id: "D", text: "260" },
//       ],
//       correctAnswer: "B",
//     },
//   ],
// };

// // ─── TEST 2: THINKING SKILLS FREE ASSESSMENT ───
// export const mockTest: QuizTest = {
//   id: "reasoning-assessment-1",
//   title: "Thinking Skills Free Assessment",
//   subtitle: "40 Questions | 40 Minutes | 10 Sections",
//   totalQuestions: 40,
//   totalMarks: 40,
//   durationMinutes: 40,
//   bundle: "Thinking Skills Free Assessment",
//   questions: [
//     {
//       id: 1,
//       text: "All painters are artists.\nSome artists are musicians.\nNo musician is a doctor.\nWhich of the following must be true?",
//       topic: "Logical Deduction",
//       difficulty: "medium",
//       options: [
//         { id: "A", text: "All painters are musicians." },
//         { id: "B", text: "Some artists are not doctors." },
//         { id: "C", text: "No painter is a doctor." },
//         { id: "D", text: "Some doctors are artists." },
//       ],
//       correctAnswer: "B",
//     },
//     {
//       id: 2,
//       text: "If it rains, the match is cancelled.\nIf the match is cancelled, the trophy is not awarded.\nThe trophy was awarded.\nWhat can be concluded?",
//       topic: "Logical Deduction",
//       difficulty: "hard",
//       options: [
//         { id: "A", text: "It rained." },
//         { id: "B", text: "It did not rain." },
//         { id: "C", text: "The match was not cancelled but it rained." },
//         { id: "D", text: "Nothing can be concluded." },
//       ],
//       correctAnswer: "B",
//     },
//     {
//       id: 3,
//       text: "Every student who studies hard passes.\nSam did not pass.\nWhat must be true about Sam?",
//       topic: "Logical Deduction",
//       difficulty: "medium",
//       options: [
//         { id: "A", text: "Sam did not study hard." },
//         { id: "B", text: "Sam studied hard." },
//         { id: "C", text: "Sam is not a student." },
//         { id: "D", text: "Sam will pass next time." },
//       ],
//       correctAnswer: "A",
//     },
//     {
//       id: 4,
//       text: "P is taller than Q. R is shorter than S. Q is taller than R. S is taller than P. Who is the tallest?",
//       topic: "Logical Deduction",
//       difficulty: "hard",
//       options: [
//         { id: "A", text: "P" },
//         { id: "B", text: "Q" },
//         { id: "C", text: "R" },
//         { id: "D", text: "S" },
//       ],
//       correctAnswer: "D",
//     },
//     {
//       id: 5,
//       text: "No reptile is warm-blooded. All snakes are reptiles. Which must be true?",
//       topic: "Logical Deduction",
//       difficulty: "medium",
//       options: [
//         { id: "A", text: "Some snakes are warm-blooded." },
//         { id: "B", text: "No snake is warm-blooded." },
//         { id: "C", text: "All reptiles are snakes." },
//         { id: "D", text: "Some reptiles are warm-blooded." },
//       ],
//       correctAnswer: "B",
//     },
//     {
//       id: 6,
//       text: "Five students A,B,C,D,E sat an exam. A scored higher than B. C scored higher than A. D scored lower than B. E scored between B and A. Who came third?",
//       topic: "Ordering & Ranking",
//       difficulty: "medium",
//       options: [
//         { id: "A", text: "A" },
//         { id: "B", text: "B" },
//         { id: "C", text: "C" },
//         { id: "D", text: "E" },
//       ],
//       correctAnswer: "D",
//     },
//     {
//       id: 7,
//       text: "Six boxes stacked (1=bottom, 6=top). P is directly above Q. R is above P but not at top. S is at the bottom. T is directly below R. U is at the top. Order bottom to top?",
//       topic: "Ordering & Ranking",
//       difficulty: "hard",
//       options: [
//         { id: "A", text: "S, Q, P, T, R, U" },
//         { id: "B", text: "Q, S, P, T, R, U" },
//         { id: "C", text: "S, P, Q, R, T, U" },
//         { id: "D", text: "S, Q, P, R, T, U" },
//       ],
//       correctAnswer: "A",
//     },
//     {
//       id: 8,
//       text: "In a race of 6, Mia finishes before Leo. Leo finishes before Priya. Kai finishes after Priya. Jess finishes between Mia and Leo. Which must be FALSE?",
//       topic: "Ordering & Ranking",
//       difficulty: "medium",
//       options: [
//         { id: "A", text: "Kai finishes last." },
//         { id: "B", text: "Priya finishes 4th." },
//         { id: "C", text: "Jess finishes 2nd." },
//         { id: "D", text: "Mia finishes 3rd." },
//       ],
//       correctAnswer: "D",
//     },
//     {
//       id: 9,
//       text: "'go home now' = 4 6 3 | 'now eat well' = 3 2 5 | 'go eat fast' = 4 2 8\nWhat is the code for 'home'?",
//       topic: "Coding & Cipher",
//       difficulty: "medium",
//       options: [
//         { id: "A", text: "4" },
//         { id: "B", text: "6" },
//         { id: "C", text: "3" },
//         { id: "D", text: "2" },
//       ],
//       correctAnswer: "B",
//     },
//     {
//       id: 10,
//       text: "RABBIT coded as 18122920 (A=1, B=2 … Z=26, double digits for letters >9).\nHow will FOX be coded?",
//       topic: "Coding & Cipher",
//       difficulty: "medium",
//       options: [
//         { id: "A", text: "61524" },
//         { id: "B", text: "6624" },
//         { id: "C", text: "62415" },
//         { id: "D", text: "61525" },
//       ],
//       correctAnswer: "A",
//     },
//     {
//       id: 11,
//       text: "Coding by digit sum of alphabet position. (S=19→10→1, T=20→2, A=1, R=18→9)\nHow is STAR coded?",
//       topic: "Coding & Cipher",
//       difficulty: "hard",
//       options: [
//         { id: "A", text: "1219" },
//         { id: "B", text: "2190" },
//         { id: "C", text: "1291" },
//         { id: "D", text: "1219" },
//       ],
//       correctAnswer: "A",
//     },
//     {
//       id: 12,
//       text: "Mathematics = { @ ' ( ^ { @ ' ) $ \"  |  Geography = * ^ [ * ; @ ] ( ~\nLiterature = = ) ' ^ ; @ ' < ; ^\nWhat is the encoding for 'I LOVE'?",
//       topic: "Coding & Cipher",
//       difficulty: "medium",
//       options: [
//         { id: "A", text: ") = [ > ^ ] ( ~ \" $ \"" },
//         { id: "B", text: ") = [ > ; @ ] ( ~ \" $)" },
//         { id: "C", text: "= ) [ > ^ ] @ ( ~ $" },
//         { id: "D", text: ") = [ ^ > ] ( \" ~ $" },
//       ],
//       correctAnswer: "B",
//     },
//     {
//       id: 13,
//       text: "Train 1 travels 120 km in 2 hours. Train 2 travels the same distance but takes 30 minutes longer. Speed difference?",
//       topic: "Mathematical Reasoning",
//       difficulty: "medium",
//       options: [
//         { id: "A", text: "10 km/h" },
//         { id: "B", text: "20 km/h" },
//         { id: "C", text: "15 km/h" },
//         { id: "D", text: "12 km/h" },
//       ],
//       correctAnswer: "D",
//     },
//     {
//       id: 14,
//       text: "A number divided by 5 leaves remainder 3. Same number divided by 7 leaves remainder 2. Smallest such positive integer?",
//       topic: "Mathematical Reasoning",
//       difficulty: "hard",
//       options: [
//         { id: "A", text: "23" },
//         { id: "B", text: "58" },
//         { id: "C", text: "33" },
//         { id: "D", text: "43" },
//       ],
//       correctAnswer: "A",
//     },
//     {
//       id: 15,
//       text: "Ratio of red to blue marbles is 3:5. There are 24 red marbles. How many blue?",
//       topic: "Mathematical Reasoning",
//       difficulty: "medium",
//       options: [
//         { id: "A", text: "30" },
//         { id: "B", text: "35" },
//         { id: "C", text: "40" },
//         { id: "D", text: "45" },
//       ],
//       correctAnswer: "C",
//     },
//     {
//       id: 16,
//       text: "Jack is twice as old as Jill. In 6 years, Jack will be 1.5 times Jill's age. How old is Jill now?",
//       topic: "Mathematical Reasoning",
//       difficulty: "hard",
//       options: [
//         { id: "A", text: "6" },
//         { id: "B", text: "12" },
//         { id: "C", text: "18" },
//         { id: "D", text: "9" },
//       ],
//       correctAnswer: "A",
//     },
//     {
//       id: 17,
//       text: "A shop reduces a price by 20%, then increases the new price by 20%. Net change in original price?",
//       topic: "Mathematical Reasoning",
//       difficulty: "medium",
//       options: [
//         { id: "A", text: "0%" },
//         { id: "B", text: "4% decrease" },
//         { id: "C", text: "4% increase" },
//         { id: "D", text: "2% decrease" },
//       ],
//       correctAnswer: "B",
//     },
//     {
//       id: 18,
//       text: "40 streetlights across North, South, East, West.\nEast+West = North+16 | South+West = North+East | East+South = West+8\nHow many lights in the North?",
//       topic: "Mathematical Reasoning",
//       difficulty: "hard",
//       options: [
//         { id: "A", text: "6" },
//         { id: "B", text: "8" },
//         { id: "C", text: "10" },
//         { id: "D", text: "12" },
//       ],
//       correctAnswer: "B",
//     },
//     {
//       id: 19,
//       text: "Cube net: face 1 opposite 6, face 2 opposite 5, face 3 opposite 4. Face 1 on top, face 2 faces you. Which face is on the right?",
//       topic: "Spatial Reasoning",
//       difficulty: "medium",
//       options: [
//         { id: "A", text: "Face 3" },
//         { id: "B", text: "Face 4" },
//         { id: "C", text: "Face 5" },
//         { id: "D", text: "Face 6" },
//       ],
//       correctAnswer: "A",
//     },
//     {
//       id: 20,
//       text: "Square paper folded in half (left over right), then again (top over bottom). Hole punched in top-right corner. When fully unfolded, how many holes?",
//       topic: "Spatial Reasoning",
//       difficulty: "hard",
//       options: [
//         { id: "A", text: "1" },
//         { id: "B", text: "2" },
//         { id: "C", text: "4" },
//         { id: "D", text: "8" },
//       ],
//       correctAnswer: "C",
//     },
//     {
//       id: 21,
//       text: "3D shape: 6 faces, 12 edges, 8 vertices. What shape?",
//       topic: "Spatial Reasoning",
//       difficulty: "medium",
//       options: [
//         { id: "A", text: "Tetrahedron" },
//         { id: "B", text: "Cube" },
//         { id: "C", text: "Triangular prism" },
//         { id: "D", text: "Octahedron" },
//       ],
//       correctAnswer: "B",
//     },
//     {
//       id: 22,
//       text: "4×4×4 cube painted red on all outer faces, then cut into 64 unit cubes. How many unit cubes have exactly 2 red faces?",
//       topic: "Spatial Reasoning",
//       difficulty: "hard",
//       options: [
//         { id: "A", text: "24" },
//         { id: "B", text: "16" },
//         { id: "C", text: "12" },
//         { id: "D", text: "8" },
//       ],
//       correctAnswer: "A",
//     },
//     {
//       id: 23,
//       text: "Argument: 'Students who play sports perform better academically because sports teach discipline.' A school bans sports to focus on studies. Which statement most weakens the school's decision?",
//       topic: "Critical Reasoning",
//       difficulty: "medium",
//       options: [
//         { id: "A", text: "Sports take time away from studying." },
//         { id: "B", text: "Discipline from sports improves academic focus." },
//         { id: "C", text: "Many top students do not play sports." },
//         { id: "D", text: "Sports are expensive to fund." },
//       ],
//       correctAnswer: "B",
//     },
//     {
//       id: 24,
//       text: "'All technology makes life easier. Smartphones are technology. Therefore, smartphones make life easier.' Main flaw?",
//       topic: "Critical Reasoning",
//       difficulty: "hard",
//       options: [
//         { id: "A", text: "Smartphones are not technology." },
//         { id: "B", text: "The premise 'all technology makes life easier' is a sweeping, unverified generalisation." },
//         { id: "C", text: "Life is already easy without technology." },
//         { id: "D", text: "The argument has no flaw." },
//       ],
//       correctAnswer: "B",
//     },
//     {
//       id: 25,
//       text: "A company claims its product is 'preferred by 8 out of 10 dentists'. Survey sampled exactly 10 dentists. Main weakness?",
//       topic: "Critical Reasoning",
//       difficulty: "medium",
//       options: [
//         { id: "A", text: "Dentists don't use the product." },
//         { id: "B", text: "The sample size is too small to generalise." },
//         { id: "C", text: "8 out of 10 is actually low." },
//         { id: "D", text: "Dentists may prefer a rival product." },
//       ],
//       correctAnswer: "B",
//     },
//     {
//       id: 26,
//       text: "Country X has more hospitals per capita than Country Y but worse health outcomes. Best explanation?",
//       topic: "Critical Reasoning",
//       difficulty: "hard",
//       options: [
//         { id: "A", text: "Country X has better doctors." },
//         { id: "B", text: "Country X has a much older and sicker population requiring more hospital care." },
//         { id: "C", text: "Country Y spends more on sports." },
//         { id: "D", text: "Country X has better roads." },
//       ],
//       correctAnswer: "B",
//     },
//     {
//       id: 27,
//       text: "2, 6, 12, 20, 30, ?",
//       topic: "Sequence & Pattern",
//       difficulty: "medium",
//       options: [
//         { id: "A", text: "40" },
//         { id: "B", text: "42" },
//         { id: "C", text: "44" },
//         { id: "D", text: "36" },
//       ],
//       correctAnswer: "B",
//     },
//     {
//       id: 28,
//       text: "1, 1, 2, 3, 5, 8, 13, ?",
//       topic: "Sequence & Pattern",
//       difficulty: "hard",
//       options: [
//         { id: "A", text: "18" },
//         { id: "B", text: "20" },
//         { id: "C", text: "21" },
//         { id: "D", text: "24" },
//       ],
//       correctAnswer: "C",
//     },
//     {
//       id: 29,
//       text: "4, 9, 25, ?, 121, 169",
//       topic: "Sequence & Pattern",
//       difficulty: "medium",
//       options: [
//         { id: "A", text: "36" },
//         { id: "B", text: "49" },
//         { id: "C", text: "64" },
//         { id: "D", text: "81" },
//       ],
//       correctAnswer: "B",
//     },
//     {
//       id: 30,
//       text: "3, 6, 11, 18, 27, ?",
//       topic: "Sequence & Pattern",
//       difficulty: "hard",
//       options: [
//         { id: "A", text: "36" },
//         { id: "B", text: "38" },
//         { id: "C", text: "40" },
//         { id: "D", text: "34" },
//       ],
//       correctAnswer: "B",
//     },
//     {
//       id: 31,
//       text: "A, C, F, J, O, ?",
//       topic: "Sequence & Pattern",
//       difficulty: "medium",
//       options: [
//         { id: "A", text: "T" },
//         { id: "B", text: "U" },
//         { id: "C", text: "V" },
//         { id: "D", text: "W" },
//       ],
//       correctAnswer: "B",
//     },
//     {
//       id: 32,
//       text: "Some A are B. All B are C. Which conclusion is definitely true?",
//       topic: "Syllogisms",
//       difficulty: "medium",
//       options: [
//         { id: "A", text: "All A are C." },
//         { id: "B", text: "Some A are C." },
//         { id: "C", text: "No A is C." },
//         { id: "D", text: "All C are A." },
//       ],
//       correctAnswer: "B",
//     },
//     {
//       id: 33,
//       text: "No M is N. Some N are P. All P are Q. Definitely true?",
//       topic: "Syllogisms",
//       difficulty: "hard",
//       options: [
//         { id: "A", text: "Some Q are not M." },
//         { id: "B", text: "All Q are N." },
//         { id: "C", text: "No Q is M." },
//         { id: "D", text: "Some M are Q." },
//       ],
//       correctAnswer: "A",
//     },
//     {
//       id: 34,
//       text: "All lions are brave. Some brave animals are tigers. No tiger is a lion.\nConclusion?",
//       topic: "Syllogisms",
//       difficulty: "medium",
//       options: [
//         { id: "A", text: "Some lions are tigers." },
//         { id: "B", text: "All tigers are brave." },
//         { id: "C", text: "There exist brave animals that are neither lions nor tigers." },
//         { id: "D", text: "No brave animal is a lion." },
//       ],
//       correctAnswer: "C",
//     },
//     {
//       id: 35,
//       text: "1st January 2024 is a Monday. 2024 is a leap year. What day is 1st February 2024?",
//       topic: "Calendar & Time",
//       difficulty: "medium",
//       options: [
//         { id: "A", text: "Thursday" },
//         { id: "B", text: "Wednesday" },
//         { id: "C", text: "Tuesday" },
//         { id: "D", text: "Friday" },
//       ],
//       correctAnswer: "A",
//     },
//     {
//       id: 36,
//       text: "A clock shows 3:15. Angle between hour and minute hands?",
//       topic: "Calendar & Time",
//       difficulty: "hard",
//       options: [
//         { id: "A", text: "7.5°" },
//         { id: "B", text: "0°" },
//         { id: "C", text: "15°" },
//         { id: "D", text: "22.5°" },
//       ],
//       correctAnswer: "A",
//     },
//     {
//       id: 37,
//       text: "Meeting starts 9:40 AM, lasts 2 hours 50 minutes. When does it end?",
//       topic: "Calendar & Time",
//       difficulty: "medium",
//       options: [
//         { id: "A", text: "12:10 PM" },
//         { id: "B", text: "12:30 PM" },
//         { id: "C", text: "12:00 PM" },
//         { id: "D", text: "1:10 PM" },
//       ],
//       correctAnswer: "B",
//     },
//     {
//       id: 38,
//       text: "W, X, Y, Z each like a different sport: cricket, tennis, football, swimming.\nW doesn't like cricket or swimming. X likes tennis. Y doesn't like football. Z likes swimming.\nWhich sport does W like?",
//       topic: "Analytical Puzzles",
//       difficulty: "hard",
//       options: [
//         { id: "A", text: "Cricket" },
//         { id: "B", text: "Tennis" },
//         { id: "C", text: "Football" },
//         { id: "D", text: "Swimming" },
//       ],
//       correctAnswer: "C",
//     },
//     {
//       id: 39,
//       text: "Orange = $2. Jack: 1 pineapple + 1 orange + 1 banana = $8. Ben: 1 pineapple + 2 apples = $11.\nLily: 1 apple + 1 orange + 1 banana. How much is Lily's fruit set worth?",
//       topic: "Analytical Puzzles",
//       difficulty: "hard",
//       options: [
//         { id: "A", text: "$6" },
//         { id: "B", text: "$5" },
//         { id: "C", text: "$7" },
//         { id: "D", text: "$8" },
//       ],
//       correctAnswer: "A",
//     },
//     {
//       id: 40,
//       text: "Five colleagues A,B,C,D,E sit in a row. A is not at either end. B sits immediately to A's left. D is at one end. C is not next to D. E is at the other end. Order left to right?",
//       topic: "Analytical Puzzles",
//       difficulty: "hard",
//       options: [
//         { id: "A", text: "D, B, A, C, E" },
//         { id: "B", text: "E, C, B, A, D" },
//         { id: "C", text: "D, C, B, A, E" },
//         { id: "D", text: "E, B, A, C, D" },
//       ],
//       correctAnswer: "C",
//     },
//   ],
// };

// // Passages for Selective Reading
// const READING_PASSAGE_PART_1 = `EXTRACT 1: "The Space Between Stations" (Contemporary Fiction, 2023)
// Amara pressed her forehead against the cold glass and watched the familiar terraces of Parramatta dissolve into streaks of amber light. Six months in Sydney, and she still felt like a tourist in her own suburb — as though the city had already written its story and simply forgotten to leave a page for her. Her mother said it would pass, the way jetlag passes: suddenly, without announcement. Amara was not convinced.

// At school, she had learned to perform fluency. She laughed one beat after everyone else, timed it by watching their shoulders. She answered questions in class using the intonation she had practised in the bathroom mirror each morning — rising at the end, soft on the consonants, the way the television presenters spoke. Only her English teacher, Ms Osei, ever looked at her as though she were already complete, not a rough draft awaiting revision.

// The train lurched, and the girl beside Amara — red-haired, freckled, wearing a hoodie that read "LOCAL" in block letters — glanced across. Amara braced for the question she always braced for: "Where are you actually from?" Instead, the girl held out an earbud. "Do you like Flume?" she asked. And Amara, for the first time in six months, said yes to something she actually meant.

// EXTRACT 2: "The New Arrival" (Historical Fiction, set 1956, written 1987)
// Konstantinos Papadimitriou stepped off the gangway at Station Pier and stood still while the crowd surged around him. He had expected a greeting — not a ceremony, but something. A sign, perhaps. He saw a man in a grey uniform holding a board that read MIGRATION and followed him without question, because that was what you did when you could not read the rest of the signs.

// In the weeks that followed, he worked at a factory in Footscray where the machines were loud enough to make conversation unnecessary. He was grateful for this. When men spoke to him at lunchtime he smiled and nodded and ate his spanakopita quickly, folding the foil so that no one could see what was inside. By October he had learned twelve English words he considered essential: yes, no, sorry, excuse me, good morning, how much, and thank you.

// The foreman — a large Scottish man named Barr who smelled of pipe tobacco — stopped beside his station one afternoon and said something long and complicated. Konstantinos understood only the final word: "good". He repeated it back — "good" — and Barr clapped him on the shoulder so hard his teeth knocked together. After that, Konstantinos decided that English, whatever else it was, was a language in which one word could carry the weight of many.`;

// const READING_PASSAGE_PART_2 = `POEM — "Low Tide at Cronulla" by J. Hartley-Marsh
// The water pulls its skirt back from the shore,
// as though embarrassed by what lies beneath —
// a litter of grey shells, the ocean's floor
// exposed and unremarkable as grief.

// The children do not notice. They are busy
// with the living things — a crab that scuttles
// sidewise from their shrieking, in a dizzy
// arc of panic through the pooled-up puddles.

// My grandmother once said the sea forgets
// everything immediately. I think
// she meant the tide — how nothing permanent sets
// in salt, how even granite learns to sink.

// I am standing at the border of two worlds:
// the one that stays, the one that is erased.
// The sea says nothing. Somewhere, a gull hurls
// itself against the wind and is displaced.`;

// const READING_PASSAGE_PART_3 = `ARTICLE — "Why Cities Are Getting Hotter" (adapted from Year 7 Science Magazine)
// If you have ever walked barefoot across a suburban driveway on a summer afternoon, you have already encountered the urban heat island effect. Cities are measurably hotter than the rural land that surrounds them — sometimes by as much as 5°C — and scientists have been studying this phenomenon for nearly two centuries.

// The cause is almost entirely architectural. Cities replace grass, trees and soil with concrete, asphalt and glass. Natural surfaces absorb sunlight during the day and release it slowly overnight, but also allow evaporation, which cools the ground. Hard surfaces such as concrete and bitumen, on the other hand, do neither. Without this natural cooling cycle, urban surfaces store heat like giant, slow-burning stoves.

// Buildings compound the problem in a second way. Tall structures prevent wind from flowing freely through a city, reducing the natural ventilation that would otherwise carry excess heat away. This tunnel effect, sometimes called the "street canyon" phenomenon, is most severe in cities with very narrow streets and uniform building heights.

// As urban temperatures rise, residents use more air conditioning, further increasing energy consumption. Air conditioning itself generates heat as a by-product, meaning that attempts to cool individual buildings can paradoxically warm the city as a whole.

// Green roofs — rooftops covered with soil and living plants — can reduce a building's surface temperature by up to 40°C compared with conventional dark roofing materials. Rows of trees planted along streets provide shade and release water vapour, cooling the air. This approach has been trialled successfully in Singapore, Toronto and Stuttgart.

// Researchers at the University of New South Wales found that painting just 10% of Sydney's roads and rooftops white could lower the city's average temperature by nearly 2°C. Lighter surfaces reflect more sunlight rather than absorbing it.

// Addressing urban heat requires a systemic redesign of how cities are built and managed. Cities that have made the greatest progress — Amsterdam, Melbourne, and Medellín in Colombia — have embedded heat reduction into planning policy, architecture, public transport, and community design simultaneously.`;

// const READING_PASSAGE_PART_4 = `TEXT A — Blog post: "AI Made Me a Better Cook" (personal lifestyle blog, April 2025)
// I genuinely did not expect to become someone who asks a chatbot what to make for dinner. But here we are. I described the sad contents of my fridge — half a zucchini, some leftover rice, a suspiciously old block of halloumi — and within seconds had a coherent recipe. Was it perfect? No. Did I eat it? Absolutely. The thing nobody tells you about AI cooking assistants is that they have no ego. They do not judge you for your fridge. I find that oddly comforting.

// TEXT B — School library report: "Understanding Artificial Intelligence" (NSW Dept of Education, 2024)
// Artificial intelligence (AI) refers to computer systems designed to perform tasks that normally require human intelligence, such as recognising patterns, making decisions, and generating language. Modern AI tools use a process called machine learning, in which programs improve their performance over time by analysing large quantities of data. AI is now used across a broad range of sectors, including healthcare, transport, education, and entertainment. It is important to note that AI systems reflect the data they are trained on and may therefore reproduce existing biases present in that data.

// TEXT C — Online book review: "The Algorithm Will See You Now" by Dr. Priya Shenfield (ReadersCircle, 2025)
// Dr. Shenfield's central argument — that AI-driven diagnostic tools are already outperforming radiologists in detecting certain cancers — is both thrilling and deeply unnerving. She is not anti-technology; she is, if anything, a cautious enthusiast. But her chapters on accountability are sobering. When an AI misdiagnoses a patient, who is responsible? The programmer? The hospital? The algorithm itself? The book does not resolve this question, and nor, Shenfield argues, does current medical law.`;

// // ─── TEST 3: SELECTIVE READING FREE ASSESSMENT ───
// export const readingAssessment: QuizTest = {
//   id: "reading-assessment-1",
//   title: "Selective Reading Free Assessment",
//   subtitle: "38 Questions | 45 Minutes | Multi-Text & Poetry",
//   totalQuestions: 38,
//   totalMarks: 38,
//   durationMinutes: 45,
//   bundle: "Selective Reading Free Assessment",
//   questions: [
//     // PART 1 (Q1-Q14)
//     {
//       id: 1,
//       text: `${READING_PASSAGE_PART_1}\n\nQ1. In Extract 1, "perform fluency" most likely suggests Amara is:`,
//       topic: "Adolescent Fiction & Historical Comparison",
//       difficulty: "medium",
//       options: [
//         { id: "A", text: "Genuinely adapting to Australian speech patterns through careful study." },
//         { id: "B", text: "Deliberately concealing her true linguistic identity to appear to belong." },
//         { id: "C", text: "Being tutored by Ms Osei in how to speak correctly in class." },
//         { id: "D", text: "Struggling with a speech impediment she has not told her mother about." },
//       ],
//       correctAnswer: "B",
//     },
//     {
//       id: 2,
//       text: `${READING_PASSAGE_PART_1}\n\nQ2. The simile comparing Amara's displacement to jetlag primarily suggests her mother believes:`,
//       topic: "Adolescent Fiction & Historical Comparison",
//       difficulty: "medium",
//       options: [
//         { id: "A", text: "Amara is physically unwell and needs a doctor." },
//         { id: "B", text: "The feeling of not belonging will eventually fade on its own." },
//         { id: "C", text: "Moving overseas was a mistake the family should reverse." },
//         { id: "D", text: "Amara is exaggerating her discomfort for attention." },
//       ],
//       correctAnswer: "B",
//     },
//     {
//       id: 3,
//       text: `${READING_PASSAGE_PART_1}\n\nQ3. "The city had already written its story and simply forgotten to leave a page for her" uses:`,
//       topic: "Adolescent Fiction & Historical Comparison",
//       difficulty: "medium",
//       options: [
//         { id: "A", text: "Simile" },
//         { id: "B", text: "Onomatopoeia" },
//         { id: "C", text: "Extended metaphor" },
//         { id: "D", text: "Hyperbole" },
//       ],
//       correctAnswer: "C",
//     },
//     {
//       id: 4,
//       text: `${READING_PASSAGE_PART_1}\n\nQ4. Why does Amara describe Ms Osei as looking at her "as though she were already complete, not a rough draft awaiting revision"?`,
//       topic: "Adolescent Fiction & Historical Comparison",
//       difficulty: "hard",
//       options: [
//         { id: "A", text: "Ms Osei is a professional editor who values writing." },
//         { id: "B", text: "Ms Osei alone treats Amara as a fully-formed person, not a work-in-progress." },
//         { id: "C", text: "Amara is hoping Ms Osei will correct her grammar mistakes." },
//         { id: "D", text: "Ms Osei disapproves of Amara's accent." },
//       ],
//       correctAnswer: "B",
//     },
//     {
//       id: 5,
//       text: `${READING_PASSAGE_PART_1}\n\nQ5. The girl offering Amara an earbud is significant because it:`,
//       topic: "Adolescent Fiction & Historical Comparison",
//       difficulty: "medium",
//       options: [
//         { id: "A", text: "Shows Australian teenagers are friendlier than Amara expected." },
//         { id: "B", text: "Represents the first moment of genuine, unperformed connection Amara experiences." },
//         { id: "C", text: "Proves music is a universal language." },
//         { id: "D", text: "Interrupts Amara's private thoughts and annoys her." },
//       ],
//       correctAnswer: "B",
//     },
//     {
//       id: 6,
//       text: `${READING_PASSAGE_PART_1}\n\nQ6. Konstantinos "folded the foil so that no one could see what was inside" primarily reveals:`,
//       topic: "Adolescent Fiction & Historical Comparison",
//       difficulty: "medium",
//       options: [
//         { id: "A", text: "His poverty and need to preserve food." },
//         { id: "B", text: "His fear that food might be stolen." },
//         { id: "C", text: "His desire to hide cultural markers that might invite unwanted attention." },
//         { id: "D", text: "His embarrassment about poor cooking skills." },
//       ],
//       correctAnswer: "C",
//     },
//     {
//       id: 7,
//       text: `${READING_PASSAGE_PART_1}\n\nQ7. Konstantinos choosing only twelve English words by October most likely shows:`,
//       topic: "Adolescent Fiction & Historical Comparison",
//       difficulty: "medium",
//       options: [
//         { id: "A", text: "He had no aptitude for language learning." },
//         { id: "B", text: "He was selective and pragmatic, focusing on words of immediate practical use." },
//         { id: "C", text: "Factory workers prevented him from learning more." },
//         { id: "D", text: "He expected to return to Greece." },
//       ],
//       correctAnswer: "B",
//     },
//     {
//       id: 8,
//       text: `${READING_PASSAGE_PART_1}\n\nQ8. "Essential" in describing the twelve English words suggests:`,
//       topic: "Adolescent Fiction & Historical Comparison",
//       difficulty: "easy",
//       options: [
//         { id: "A", text: "They were the most difficult words." },
//         { id: "B", text: "They were chosen to keep him safe." },
//         { id: "C", text: "They were the minimum required to function with dignity in his new environment." },
//         { id: "D", text: "They were assigned by his employer." },
//       ],
//       correctAnswer: "C",
//     },
//     {
//       id: 9,
//       text: `${READING_PASSAGE_PART_1}\n\nQ9. Konstantinos's conclusion that English is "a language in which one word can carry the weight of many" reveals his:`,
//       topic: "Adolescent Fiction & Historical Comparison",
//       difficulty: "hard",
//       options: [
//         { id: "A", text: "Frustration that English is too imprecise." },
//         { id: "B", text: "Growing philosophical appreciation for language as a tool of human connection." },
//         { id: "C", text: "Decision to stop learning additional vocabulary." },
//         { id: "D", text: "Regret that he did not study English before emigrating." },
//       ],
//       correctAnswer: "B",
//     },
//     {
//       id: 10,
//       text: `${READING_PASSAGE_PART_1}\n\nQ10. How does the ending of Extract 2 differ in tone from Extract 1?`,
//       topic: "Adolescent Fiction & Historical Comparison",
//       difficulty: "hard",
//       options: [
//         { id: "A", text: "Extract 1 ends with cautious optimism through an unexpected human gesture; Extract 2 ends with quiet philosophical reflection." },
//         { id: "B", text: "Extract 1 ends with despair; Extract 2 with humour." },
//         { id: "C", text: "Both end with identical tones of quiet triumph." },
//         { id: "D", text: "Extract 2 ends with bitterness; Extract 1 with nostalgia." },
//       ],
//       correctAnswer: "A",
//     },
//     {
//       id: 11,
//       text: `${READING_PASSAGE_PART_1}\n\nQ11. Which narrative technique is used in BOTH extracts?`,
//       topic: "Adolescent Fiction & Historical Comparison",
//       difficulty: "medium",
//       options: [
//         { id: "A", text: "First-person confessional narration." },
//         { id: "B", text: "Close third-person narration that reveals the character's inner thoughts." },
//         { id: "C", text: "Second-person narration addressing the reader directly." },
//         { id: "D", text: "Omniscient narrator who comments from a distance." },
//       ],
//       correctAnswer: "B",
//     },
//     {
//       id: 12,
//       text: `${READING_PASSAGE_PART_1}\n\nQ12. Most significant difference in HOW the two extracts show adjustment to a new environment:`,
//       topic: "Adolescent Fiction & Historical Comparison",
//       difficulty: "hard",
//       options: [
//         { id: "A", text: "Extract 1 focuses on emotional and social performance; Extract 2 on pragmatic survival strategies." },
//         { id: "B", text: "Extract 1 uses dialogue; Extract 2 uses description only." },
//         { id: "C", text: "Extract 1 is set in a rural area; Extract 2 in a city." },
//         { id: "D", text: "Extract 2 shows successful integration; Extract 1 shows complete failure." },
//       ],
//       correctAnswer: "A",
//     },
//     {
//       id: 13,
//       text: `${READING_PASSAGE_PART_1}\n\nQ13. Theme common to BOTH extracts:`,
//       topic: "Adolescent Fiction & Historical Comparison",
//       difficulty: "medium",
//       options: [
//         { id: "A", text: "Immigration inevitably leads to cultural erasure." },
//         { id: "B", text: "Language is the only barrier to meaningful connection." },
//         { id: "C", text: "Small, unexpected moments of acceptance can ease the experience of displacement." },
//         { id: "D", text: "Schools and workplaces are equally effective for integration." },
//       ],
//       correctAnswer: "C",
//     },
//     {
//       id: 14,
//       text: `${READING_PASSAGE_PART_1}\n\nQ14. "The crowd surged around him" conveys a sense of:`,
//       topic: "Adolescent Fiction & Historical Comparison",
//       difficulty: "easy",
//       options: [
//         { id: "A", text: "Slow and orderly movement." },
//         { id: "B", text: "Powerful, overwhelming movement the character cannot control." },
//         { id: "C", text: "Joyful celebration from other migrants." },
//         { id: "D", text: "Deliberate hostility toward Konstantinos." },
//       ],
//       correctAnswer: "B",
//     },
//     // PART 2 (Q15-Q24)
//     {
//       id: 15,
//       text: `${READING_PASSAGE_PART_2}\n\nQ15. "Exposed and unremarkable as grief" is best described as:`,
//       topic: "Poetry",
//       difficulty: "easy",
//       options: [
//         { id: "A", text: "A simile suggesting both the ocean floor and grief are commonly overlooked despite their significance." },
//         { id: "B", text: "A metaphor comparing grief to a geological formation." },
//         { id: "C", text: "Personification of the ocean experiencing human emotions." },
//         { id: "D", text: "Hyperbole exaggerating the poet's sadness." },
//       ],
//       correctAnswer: "A",
//     },
//     {
//       id: 16,
//       text: `${READING_PASSAGE_PART_2}\n\nQ16. "The water pulls its skirt back from the shore" uses personification to suggest the ocean is:`,
//       topic: "Poetry",
//       difficulty: "medium",
//       options: [
//         { id: "A", text: "Aggressive and dangerous." },
//         { id: "B", text: "Modest or self-conscious about what it reveals." },
//         { id: "C", text: "Controlled by a powerful external force." },
//         { id: "D", text: "Retreating in fear from the children." },
//       ],
//       correctAnswer: "B",
//     },
//     {
//       id: 17,
//       text: `${READING_PASSAGE_PART_2}\n\nQ17. Why does the poet contrast the children's behaviour with the speaker's mood?`,
//       topic: "Poetry",
//       difficulty: "medium",
//       options: [
//         { id: "A", text: "To show children are careless near water." },
//         { id: "B", text: "To highlight how youth and age perceive the same scene through entirely different emotional filters." },
//         { id: "C", text: "To argue nature education should begin in early childhood." },
//         { id: "D", text: "To suggest the speaker envies children for their energy." },
//       ],
//       correctAnswer: "B",
//     },
//     {
//       id: 18,
//       text: `${READING_PASSAGE_PART_2}\n\nQ18. The crab moving in "a dizzy arc of panic" most likely functions as:`,
//       topic: "Poetry",
//       difficulty: "medium",
//       options: [
//         { id: "A", text: "Comic relief to lighten the tone." },
//         { id: "B", text: "A symbol of the speaker's own sense of displacement and loss of control." },
//         { id: "C", text: "Evidence the beach is unsafe for children." },
//         { id: "D", text: "A literal observation with no broader symbolic meaning." },
//       ],
//       correctAnswer: "B",
//     },
//     {
//       id: 19,
//       text: `${READING_PASSAGE_PART_2}\n\nQ19. The grandmother's observation that "the sea forgets everything immediately" is introduced to:`,
//       topic: "Poetry",
//       difficulty: "medium",
//       options: [
//         { id: "A", text: "Provide factual information about tides." },
//         { id: "B", text: "Contrast the grandmother's science with the speaker's emotion." },
//         { id: "C", text: "Introduce a personal memory that deepens the poem's meditation on impermanence." },
//         { id: "D", text: "Argue that forgetting is a positive response to loss." },
//       ],
//       correctAnswer: "C",
//     },
//     {
//       id: 20,
//       text: `${READING_PASSAGE_PART_2}\n\nQ20. "How even granite learns to sink" conveys:`,
//       topic: "Poetry",
//       difficulty: "hard",
//       options: [
//         { id: "A", text: "That even the hardest and most permanent things are eventually worn away or changed." },
//         { id: "B", text: "That granite is the most interesting geological material on beaches." },
//         { id: "C", text: "That the speaker has studied geology." },
//         { id: "D", text: "That the ocean can destroy solid rock instantly." },
//       ],
//       correctAnswer: "A",
//     },
//     {
//       id: 21,
//       text: `${READING_PASSAGE_PART_2}\n\nQ21. The image of the gull hurling "itself against the wind" most closely mirrors:`,
//       topic: "Poetry",
//       difficulty: "hard",
//       options: [
//         { id: "A", text: "The speaker's sense of futile struggle against circumstances they cannot change." },
//         { id: "B", text: "The physical difficulty of standing on an exposed beach." },
//         { id: "C", text: "The children's energetic play in stanza 2." },
//         { id: "D", text: "The grandmother's belief that the sea forgets everything." },
//       ],
//       correctAnswer: "A",
//     },
//     {
//       id: 22,
//       text: `${READING_PASSAGE_PART_2}\n\nQ22. "I am standing at the border of two worlds" is best interpreted as:`,
//       topic: "Poetry",
//       difficulty: "easy",
//       options: [
//         { id: "A", text: "Literally standing between ocean and land." },
//         { id: "B", text: "Suspended between past memory and present reality, or between youth and age." },
//         { id: "C", text: "Travelling between two countries at time of writing." },
//         { id: "D", text: "Undecided about whether to enter the water." },
//       ],
//       correctAnswer: "B",
//     },
//     {
//       id: 23,
//       text: `${READING_PASSAGE_PART_2}\n\nQ23. Dominant mood of the poem overall:`,
//       topic: "Poetry",
//       difficulty: "medium",
//       options: [
//         { id: "A", text: "Joyful and celebratory." },
//         { id: "B", text: "Angry and bitter." },
//         { id: "C", text: "Contemplative and melancholic, exploring loss and impermanence." },
//         { id: "D", text: "Detached and scientific." },
//       ],
//       correctAnswer: "C",
//     },
//     {
//       id: 24,
//       text: `${READING_PASSAGE_PART_2}\n\nQ24. The ABAB rhyme scheme contributes to meaning by:`,
//       topic: "Poetry",
//       difficulty: "medium",
//       options: [
//         { id: "A", text: "Creating a sense of chaos mirroring the speaker's state." },
//         { id: "B", text: "Providing an ordered, recurring pattern that contrasts with the poem's theme of constant change." },
//         { id: "C", text: "Making the poem easier to memorise." },
//         { id: "D", text: "Signalling the poem belongs to Australian bush poetry tradition." },
//       ],
//       correctAnswer: "B",
//     },
//     // PART 3 (Q25-Q35)
//     {
//       id: 25,
//       text: `${READING_PASSAGE_PART_3}\n\nQ25. Primary cause of urban heat island effect identified in the article:`,
//       topic: "Factual Text",
//       difficulty: "easy",
//       options: [
//         { id: "A", text: "Population density and body heat." },
//         { id: "B", text: "Replacement of natural surfaces with materials that cannot cool through evaporation." },
//         { id: "C", text: "Industrial activity and factory emissions." },
//         { id: "D", text: "Gradual warming due to greenhouse gases." },
//       ],
//       correctAnswer: "B",
//     },
//     {
//       id: 26,
//       text: `${READING_PASSAGE_PART_3}\n\nQ26. "Giant, slow-burning stoves" is an example of:`,
//       topic: "Factual Text",
//       difficulty: "easy",
//       options: [
//         { id: "A", text: "A simile comparing urban surfaces to kitchen appliances." },
//         { id: "B", text: "A metaphor conveying how urban surfaces retain and release heat." },
//         { id: "C", text: "Personification giving urban materials human-like qualities." },
//         { id: "D", text: "An analogy drawn from a scientific report." },
//       ],
//       correctAnswer: "B",
//     },
//     {
//       id: 27,
//       text: `${READING_PASSAGE_PART_3}\n\nQ27. "Paradoxically warm the city as a whole" means:`,
//       topic: "Factual Text",
//       difficulty: "medium",
//       options: [
//         { id: "A", text: "Air conditioners are inefficient and don't actually cool buildings." },
//         { id: "B", text: "Energy used by air conditioners increases global warming long-term." },
//         { id: "C", text: "Heat expelled by air conditioners adds to outdoor temperature even while cooling interiors." },
//         { id: "D", text: "Cities using more AC are in hotter climates to begin with." },
//       ],
//       correctAnswer: "C",
//     },
//     {
//       id: 28,
//       text: `${READING_PASSAGE_PART_3}\n\nQ28. "Compound" as used in "Buildings compound the problem" is closest in meaning to:`,
//       topic: "Factual Text",
//       difficulty: "medium",
//       options: [
//         { id: "A", text: "Simplify" },
//         { id: "B", text: "Describe" },
//         { id: "C", text: "Intensify" },
//         { id: "D", text: "Isolate" },
//       ],
//       correctAnswer: "C",
//     },
//     {
//       id: 29,
//       text: `${READING_PASSAGE_PART_3}\n\nQ29. Most accurate inference about green roofs:`,
//       topic: "Factual Text",
//       difficulty: "hard",
//       options: [
//         { id: "A", text: "Proven solution that will eliminate urban heat in all cities within 10 years." },
//         { id: "B", text: "They address the problem at building scale and can contribute to a wider solution." },
//         { id: "C", text: "Only effective in tropical cities like Singapore." },
//         { id: "D", text: "They work by reflecting sunlight using light-coloured soil." },
//       ],
//       correctAnswer: "B",
//     },
//     {
//       id: 30,
//       text: `${READING_PASSAGE_PART_3}\n\nQ30. According to UNSW research, painting 10% of Sydney's roads and rooftops white would:`,
//       topic: "Factual Text",
//       difficulty: "hard",
//       options: [
//         { id: "A", text: "Reduce temperature by nearly 5°C." },
//         { id: "B", text: "Eliminate need for AC in residential buildings." },
//         { id: "C", text: "Lower the city's average temperature by nearly 2°C." },
//         { id: "D", text: "Reduce energy consumption by approximately 10%." },
//       ],
//       correctAnswer: "C",
//     },
//     {
//       id: 31,
//       text: `${READING_PASSAGE_PART_3}\n\nQ31. Examples of Amsterdam, Melbourne, and Medellín serve to:`,
//       topic: "Factual Text",
//       difficulty: "medium",
//       options: [
//         { id: "A", text: "Suggest only large or wealthy cities can afford solutions." },
//         { id: "B", text: "Demonstrate internationally coordinated policy is required." },
//         { id: "C", text: "Provide evidence that a multifaceted integrated approach has produced real results in different cities." },
//         { id: "D", text: "Argue Australian cities should copy European and South American planning exactly." },
//       ],
//       correctAnswer: "C",
//     },
//     {
//       id: 32,
//       text: `${READING_PASSAGE_PART_3}\n\nQ32. "Street canyon phenomenon" most likely refers to:`,
//       topic: "Factual Text",
//       difficulty: "medium",
//       options: [
//         { id: "A", text: "Flooding caused by heavy rain in narrow streets." },
//         { id: "B", text: "A situation in which tall buildings on narrow streets block wind and trap heat." },
//         { id: "C", text: "Visual effect of looking up at tall buildings." },
//         { id: "D", text: "Noise pollution created by traffic." },
//       ],
//       correctAnswer: "B",
//     },
//     {
//       id: 33,
//       text: `${READING_PASSAGE_PART_3}\n\nQ33. Author's primary purpose:`,
//       topic: "Factual Text",
//       difficulty: "easy",
//       options: [
//         { id: "A", text: "To persuade governments to ban air conditioning." },
//         { id: "B", text: "To entertain young readers with surprising facts." },
//         { id: "C", text: "To inform readers about causes of, and solutions to, the urban heat island effect." },
//         { id: "D", text: "To argue all cities should be rebuilt from scratch." },
//       ],
//       correctAnswer: "C",
//     },
//     {
//       id: 34,
//       text: `${READING_PASSAGE_PART_3}\n\nQ34. Text structure of the article:`,
//       topic: "Factual Text",
//       difficulty: "medium",
//       options: [
//         { id: "A", text: "Chronological order." },
//         { id: "B", text: "Problem-cause-solution structure." },
//         { id: "C", text: "Compare-and-contrast." },
//         { id: "D", text: "Narrative structure." },
//       ],
//       correctAnswer: "B",
//     },
//     {
//       id: 35,
//       text: `${READING_PASSAGE_PART_3}\n\nQ35. The opening sentence is designed to:`,
//       topic: "Factual Text",
//       difficulty: "easy",
//       options: [
//         { id: "A", text: "Provide precise scientific measurement of surface temperature." },
//         { id: "B", text: "Warn readers about dangers of walking without shoes." },
//         { id: "C", text: "Immediately connect a universal personal experience to the article's scientific topic." },
//         { id: "D", text: "Establish the article is written specifically for Australian readers." },
//       ],
//       correctAnswer: "C",
//     },
//     // PART 4 (Q36-Q38)
//     {
//       id: 36,
//       text: `${READING_PASSAGE_PART_4}\n\nQ36. TEXT A uses which tone to engage its reader?`,
//       topic: "Multi-Text Analysis",
//       difficulty: "medium",
//       options: [
//         { id: "A", text: "Formal and authoritative, citing research to support its claims." },
//         { id: "B", text: "Conversational and self-deprecating, using humour to make its point." },
//         { id: "C", text: "Analytical and detached, evaluating AI tools from a distance." },
//         { id: "D", text: "Alarmed and urgent, warning readers about the dangers of AI." },
//       ],
//       correctAnswer: "B",
//     },
//     {
//       id: 37,
//       text: `${READING_PASSAGE_PART_4}\n\nQ37. In TEXT A, "the thing nobody tells you about AI cooking assistants is that they have no ego" suggests the author values:`,
//       topic: "Multi-Text Analysis",
//       difficulty: "medium",
//       options: [
//         { id: "A", text: "That the AI provides nutritionally balanced meals." },
//         { id: "B", text: "That the AI never judges or criticises the user's choices." },
//         { id: "C", text: "That the AI can replace a professional chef." },
//         { id: "D", text: "That the AI works faster than any human cook." },
//       ],
//       correctAnswer: "B",
//     },
//     {
//       id: 38,
//       text: `${READING_PASSAGE_PART_4}\n\nQ38. TEXT B differs from the other texts primarily because it:`,
//       topic: "Multi-Text Analysis",
//       difficulty: "easy",
//       options: [
//         { id: "A", text: "Expresses a strong personal opinion about whether AI is harmful." },
//         { id: "B", text: "Focuses only on the use of AI in healthcare settings." },
//         { id: "C", text: "Presents factual, objective information without a personal viewpoint." },
//         { id: "D", text: "Was written by a student rather than a professional author." },
//       ],
//       correctAnswer: "C",
//     },
//   ],
// };

// // ─── TEST 4: WRITING SKILLS FREE ASSESSMENT ───
// export const writingAssessment: QuizTest = {
//   id: "writing-assessment-1",
//   title: "Writing Skills Free Assessment",
//   subtitle: "1 Question | 30 Minutes | Free-Response Prompt",
//   totalQuestions: 1,
//   totalMarks: 20,
//   durationMinutes: 30,
//   bundle: "Writing Skills Free Assessment",
//   type: "writing",
//   questions: [
//     {
//       id: 1,
//       text: "Write a short narrative describing a time when you had to overcome a challenge. Focus on how you felt and what you learned from the experience.",
//       topic: "Creative Writing",
//       difficulty: "medium",
//       options: [],
//       correctAnswer: "",
//     },
//   ],
// };

// export const quizTests: Record<string, QuizTest> = {
//   [mockTest.id]: mockTest,
//   [mathAssessment.id]: mathAssessment,
//   [writingAssessment.id]: writingAssessment,
//   [readingAssessment.id]: readingAssessment,
// };

// export function getQuizTest(testId: string): QuizTest {
//   return quizTests[testId] ?? mockTest;
// }
