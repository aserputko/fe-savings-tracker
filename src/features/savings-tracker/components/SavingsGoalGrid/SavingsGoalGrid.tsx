import type { SavingsGoalResponseDto } from '../../../../api/generated';
import type { GoalCardState } from '../SavingsTrackerGoaldCard';
import { SavingsTrackerGoalCard } from '../SavingsTrackerGoaldCard';

interface SavingsGoalGridProps {
  goals: SavingsGoalResponseDto[];
}

function deriveState(currentAmount: number, targetAmount: number): GoalCardState {
  if (targetAmount > 0 && currentAmount >= targetAmount) return 'complete';
  if (currentAmount === 0) return 'noProgress';
  return 'inProgress';
}

function toDeadline(deadline: object | string | null | undefined): Date | null {
  if (!deadline) return null;
  return new Date(deadline as string);
}

/**
 * Renders a group of 4 cards in the alternating A/B pattern from the Figma design:
 *   Pattern A (even): [wide + 2×default] | [tall]
 *   Pattern B (odd):  [tall] | [wide + 2×default]
 */
function GoalCardGroup({
  cards,
  groupIndex,
}: {
  cards: SavingsGoalResponseDto[];
  groupIndex: number;
}) {
  const [first, second, third, fourth] = cards;
  const isPatternA = groupIndex % 2 === 0;

  const wideCard = first && (
    <SavingsTrackerGoalCard
      key={first.id}
      goalName={first.name}
      targetAmount={first.targetAmount}
      currentAmount={first.currentAmount}
      deadline={toDeadline(first.deadline)}
      size='wide'
      state={deriveState(first.currentAmount, first.targetAmount)}
      className='w-full'
    />
  );

  const defaultPair = (
    <div className='flex gap-6'>
      {second && (
        <SavingsTrackerGoalCard
          key={second.id}
          goalName={second.name}
          targetAmount={second.targetAmount}
          currentAmount={second.currentAmount}
          deadline={toDeadline(second.deadline)}
          size='default'
          state={deriveState(second.currentAmount, second.targetAmount)}
          className='flex-1'
        />
      )}
      {third && (
        <SavingsTrackerGoalCard
          key={third.id}
          goalName={third.name}
          targetAmount={third.targetAmount}
          currentAmount={third.currentAmount}
          deadline={toDeadline(third.deadline)}
          size='default'
          state={deriveState(third.currentAmount, third.targetAmount)}
          className='flex-1'
        />
      )}
    </div>
  );

  const tallCard = fourth && (
    <SavingsTrackerGoalCard
      key={fourth.id}
      goalName={fourth.name}
      targetAmount={fourth.targetAmount}
      currentAmount={fourth.currentAmount}
      deadline={toDeadline(fourth.deadline)}
      size='tall'
      state={deriveState(fourth.currentAmount, fourth.targetAmount)}
      className='w-full h-full'
    />
  );

  const leftCol = isPatternA ? (
    <div className='flex flex-col gap-6 flex-[2_0_0] min-w-0'>
      {wideCard}
      {(second || third) && defaultPair}
    </div>
  ) : (
    <div className='flex flex-col flex-[1_0_0] min-w-0'>{fourth && tallCard}</div>
  );

  const rightCol = isPatternA ? (
    <div className='flex flex-col flex-[1_0_0] min-w-0'>{fourth && tallCard}</div>
  ) : (
    <div className='flex flex-col gap-6 flex-[2_0_0] min-w-0'>
      {wideCard}
      {(second || third) && defaultPair}
    </div>
  );

  return (
    <div className='flex gap-6 items-stretch w-full'>
      {leftCol}
      {rightCol}
    </div>
  );
}

export function SavingsGoalGrid({ goals }: SavingsGoalGridProps) {
  const groups: SavingsGoalResponseDto[][] = [];
  for (let i = 0; i < goals.length; i += 4) {
    groups.push(goals.slice(i, i + 4));
  }

  const lastGroup = groups[groups.length - 1];
  const hasPartialGroup = lastGroup && lastGroup.length < 4;

  const fullGroups = hasPartialGroup ? groups.slice(0, -1) : groups;
  const remainder = hasPartialGroup ? lastGroup : [];

  return (
    <div className='flex flex-col gap-6 w-full'>
      {fullGroups.map((group, index) => (
        <GoalCardGroup key={index} cards={group} groupIndex={index} />
      ))}
      {remainder.length > 0 && (
        <div className='flex gap-6 flex-wrap'>
          {remainder.map((goal) => (
            <SavingsTrackerGoalCard
              key={goal.id}
              goalName={goal.name}
              targetAmount={goal.targetAmount}
              currentAmount={goal.currentAmount}
              deadline={toDeadline(goal.deadline)}
              size='default'
              state={deriveState(goal.currentAmount, goal.targetAmount)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
