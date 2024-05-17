// https://devforum.roblox.com/t/humanoidaddaccessory-does-not-work-with-fe-from-a-localscript/33657/4

const isServer = game.GetService("RunService").IsServer();

const weldAttachments = (attach1: Attachment, attach2: Attachment) => {
	const weld = new Instance("Weld");
	weld.Part0 = attach1.Parent as BasePart;
	weld.Part1 = attach2.Parent as BasePart;
	weld.C0 = attach1.CFrame;
	weld.C1 = attach2.CFrame;
	weld.Parent = attach1.Parent;
	return weld;
};

const buildWeld = (weldName: string, parent: Instance, part0: BasePart, part1: BasePart, c0: CFrame, c1: CFrame) => {
	const weld = new Instance("Weld");
	weld.Name = weldName;
	weld.Part0 = part0;
	weld.Part1 = part1;
	weld.C0 = c0;
	weld.C1 = c1;
	weld.Parent = parent;
	return weld;
};

const findFirstMatchingAttachment = (model: Instance, name: string): Attachment | undefined => {
	for (const child of model.GetDescendants()) {
		if (child.IsA("Attachment") && child.Name === name && !child.IsA("Tool")) {
			return child;
		}
	}
};

const addAccoutrement = (character: Model, accoutrement: Accoutrement) => {
	accoutrement.Parent = character;

	// Our job is done here
	if (isServer) {
		return;
	}

	const handle = accoutrement.FindFirstChild("Handle");

	if (handle && handle.IsA("BasePart")) {
		const accoutrementAttachment = handle.FindFirstChildOfClass("Attachment");
		if (accoutrementAttachment) {
			const characterAttachment = findFirstMatchingAttachment(character, accoutrementAttachment.Name);
			if (characterAttachment) {
				weldAttachments(characterAttachment, accoutrementAttachment);
			}
		} else {
			const head = character.FindFirstChild("Head");
			if (head && head.IsA("BasePart")) {
				const attachmentCFrame = new CFrame(0, 0.5, 0);
				const hatCFrame = accoutrement.AttachmentPoint;
				buildWeld("HeadWeld", head, head, handle, attachmentCFrame, hatCFrame);
			}
		}
	}
};

/**
 * Add an accessory to a character on the server or the client.
 *
 * @param character The character to add the model to
 * @param accessory The accessory
 */
const addAccessory = (character: Model, accessory: Accessory) => {
	return addAccoutrement(character, accessory);
};

export default addAccessory;
