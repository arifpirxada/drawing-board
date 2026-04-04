export const getWorldPosition = (stage) => {
    const pointer = stage.getPointerPosition();
    const stagePosition = stage.position();
    const scale = stage.scaleX();

    return {
        x: (pointer.x - stagePosition.x) / scale,
        y: (pointer.y - stagePosition.y) / scale
    };
};