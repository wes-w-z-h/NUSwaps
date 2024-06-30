import { ISwap } from '../../types/api.js';

// TODO: Implement this into addSwap and updateSwap controllers
function findTwoWay(req: ISwap, moduleRequests: ISwap[]): ISwap[] | null {
  const twoWaySwaps = moduleRequests.filter((swap) => {
    return swap.request === req.current && swap.current === req.request;
  });

  if (twoWaySwaps.length === 0) {
    return null;
  }

  const earliestSwap = twoWaySwaps.reduce((prev, curr) => {
    return prev.updatedAt < curr.updatedAt ? prev : curr;
  });

  return [req, earliestSwap];
}

// req -> B -> C -> req
// TODO: Optimise the time complexity even further
function findThreeWay(req: ISwap, moduleRequests: ISwap[]): ISwap[] | null {
  const B = moduleRequests.filter((swap) => req.request === swap.current);
  const C: ISwap[][] = [];
  B.forEach((currSwap) => {
    moduleRequests.forEach((nextSwap) => {
      if (currSwap.request === nextSwap.current) {
        C.push([currSwap, nextSwap]);
      }
    });
  });
  const trios = C.filter((swap) => swap[1].request === req.current);

  if (trios.length === 0) {
    return null;
  }

  let earliestDate = trios[0][0].updatedAt;
  let earliestTrio = trios[0];
  trios.forEach((trio) => {
    if (trio[0].updatedAt <= earliestDate) {
      earliestDate = trio[0].updatedAt;
      earliestTrio = trio;
    }
    if (trio[1].updatedAt <= earliestDate) {
      earliestDate = trio[1].updatedAt;
      earliestTrio = trio;
    }
  });

  return [req, ...earliestTrio];
}

// Given an array of existing requests and a new request,
// find possible 2/3 way swaps for the new request
export default function greedyMatch(req: ISwap, existing: ISwap[]): ISwap[] {
  const moduleRequests = existing.filter((swap) => {
    return (
      swap.courseId === req.courseId &&
      swap.lessonType === req.lessonType &&
      swap.status === 'UNMATCHED'
    );
  });

  if (moduleRequests.length <= 1) {
    return [];
  }

  const pair = findTwoWay(req, moduleRequests);
  if (pair) {
    return pair;
  }

  const trio = findThreeWay(req, moduleRequests);
  if (trio) {
    return trio;
  }

  return [];
}
