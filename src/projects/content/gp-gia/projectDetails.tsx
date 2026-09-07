'use client';

import { Label } from '@apple-pie/slice';
import { HeroImage } from '@/components/HeroImage/HeroImage';
import { InlineTitle } from '@/components/InlineTitle/InlineTitle';
import { Logo } from '@/components/Logos/Logos';
import { ProjectHighlight } from '@/components/ProjectHighlight/ProjectHighlight';
import { ProjectTitle } from '@/components/ProjectTitle/ProjectTitle';
import { Section } from '@/components/Section/Section';
import { SubTitle } from '@/components/SubTitle/SubTitle';
import { TechStack } from '@/components/TechStack/TechStack';
import { TextParagraph } from '@/components/TextParagraph/TextParagraph';
import { TextTitle } from '@/components/TextTitle/TextTitle';
import { Wrapper } from '@/projects/_helpers/Wrapper';
import projectJson from '@/projects/content/gp-gia/project.json';
import { themedImages } from './images';

export default function GPGiaProjectDetails() {
	const header = projectJson.header || {};

	return (
		<Wrapper>
			<Section gradient={false}>
				<Logo name={'gp'} color={'var(--core-icon-primary)'} size={64} margin={'0 0 64px 0'} />
				<ProjectTitle>{header.title}</ProjectTitle>
				<SubTitle margin={false}>{header.subtitle}</SubTitle>
				<HeroImage
					heroImage={themedImages.hero}
					backgroundImage={themedImages.heroBG}
					border={false}
					heroAltText={'Gia workspace showing an HR question, sourced guidance, and a generated document.'}
				/>
				<TechStack>
					{header.techStack.map((item) => (
						<Label key={item}>{item}</Label>
					))}
				</TechStack>
				<InlineTitle title={'Highlights'} />
				<ProjectHighlight
					themedImage={themedImages.source}
					alt={'Gia answer with visible citations and approved source material.'}
				>
					<TextTitle>Trust has to be visible</TextTitle>
					<TextParagraph>
						<p>
							In high-stakes HR and legal-adjacent work, a fluent answer is not enough. Gia&apos;s guidance is built and
							reviewed by in-market legal and HR professionals, giving users a stronger foundation than a
							general-purpose model can provide from an uncurated prompt alone.
						</p>
					</TextParagraph>
				</ProjectHighlight>
				<ProjectHighlight
					themedImage={themedImages.artifact}
					reverse
					alt={'Gia research guidance transformed into an editable HR document.'}
				>
					<TextTitle>Guidance becomes a usable artifact</TextTitle>
					<TextParagraph>
						<p>
							Gia moves beyond the traditional chat endpoint. Research and guidance can become an HR document that a
							team can review, edit, collaborate on, and carry into a real process.
						</p>
					</TextParagraph>
				</ProjectHighlight>
				<ProjectHighlight
					themedImage={themedImages.artifact}
					alt={'Gia workspace combining conversation, source material, and a working document.'}
				>
					<TextTitle>A workspace, not a prompt box</TextTitle>
					<TextParagraph>
						<p>
							The experience keeps the question, supporting evidence, generated work, and next steps in view together.
							People do not have to choose between asking the system and doing the work.
						</p>
					</TextParagraph>
				</ProjectHighlight>
				<ProjectHighlight
					themedImage={themedImages.collaborate}
					reverse
					alt={'Team reviewing or collaboratively editing a generated HR artifact in Gia.'}
				>
					<TextTitle>Collaboration is part of the outcome</TextTitle>
					<TextParagraph>
						<p>
							Generated work is a starting point, not a handoff. Gia supports the human review and collaboration needed
							to turn an informed draft into something a team is ready to use.
						</p>
					</TextParagraph>
				</ProjectHighlight>
				<ProjectHighlight
					themedImage={themedImages.monitor}
					nomargin
					alt={
						'Gia compliance monitor showing a regulatory update, its potential impact on company HR policy, and the next action to review.'
					}
				>
					<TextTitle>Compliance changes become actionable work</TextTitle>
					<TextParagraph>
						<p>
							Gia is not limited to waiting for a question. It can assess relevant regulatory updates against a
							team&apos;s HR content, documents, and contracts, then surface where current policy may need attention.
						</p>
					</TextParagraph>
				</ProjectHighlight>
			</Section>
			<Section gradient={true}>
				<ProjectTitle>Generative AI needed to meet a higher bar for trust</ProjectTitle>
				<SubTitle marginSize={16}>
					HR teams work with decisions where context, policy, and compliance matter. For global teams working across 50+
					countries, the country-specific context is part of the answer, not an edge case. That creates an unusually
					high threshold for trust: a generic chat interface could make an answer feel fast, but it could not make the
					answer appropriately trustworthy or ready to act on.
				</SubTitle>
				<SubTitle marginSize={16}>
					Gia was designed to raise the quality bar for HR guidance. Instead of relying only on broad, general-purpose
					model knowledge, it starts with material written and reviewed by the in-market legal and HR professionals
					closest to the work.
				</SubTitle>
				<SubTitle>
					The core product question was: how can generative AI meet that higher threshold of trust while helping a
					professional research and move work forward, with the evidence, uncertainty, and human judgment still visible?
				</SubTitle>
				<HeroImage
					heroImage={themedImages.verified}
					dropShadow={false}
					border={true}
					heroMargin={0}
					standAlone={true}
					heroAltText={"Comparison between an opaque AI answer and Gia's expert-grounded, reviewable workflow."}
				/>
			</Section>
			<Section gradient={true}>
				<ProjectTitle>Trust was a product feature</ProjectTitle>
				<SubTitle marginSize={16}>
					Gia was designed around a deliberately stronger knowledge foundation: material written and reviewed by
					in-market legal and HR professionals, citations that stay connected to the answer, and clearer paths for a
					professional to inspect the underlying guidance.
				</SubTitle>
				<SubTitle marginSize={16}>
					<strong>Expert-built knowledge:</strong> In-market legal and HR professionals write and review the source
					material that grounds the experience.
				</SubTitle>
				<SubTitle marginSize={16}>
					<strong>Global context:</strong> Gia is fluent across 50+ countries, so users can approach country-specific HR
					work with the local context it requires.
				</SubTitle>
				<SubTitle marginSize={16}>
					<strong>Visible citations:</strong> Source material is part of the interface, so users can understand where
					guidance came from and investigate further.
				</SubTitle>
				<SubTitle marginSize={16}>
					<strong>Transparent guardrails:</strong> Gia does not fill gaps with invented information. When it cannot find
					suitable information for a confident answer, it says so and points the user toward resources that can help.
				</SubTitle>
				<SubTitle margin={false}>
					<strong>Professional control:</strong> The system helps people form a confident judgment; it does not pretend
					to replace that judgment.
				</SubTitle>
			</Section>
			<Section gradient={true}>
				<ProjectTitle>Teaching Gia with in-market expertise</ProjectTitle>
				<SubTitle marginSize={16}>
					The knowledge foundation alone was not enough. We also needed a practical way for the lawyers and HR
					professionals closest to each country to shape how Gia handled real work.
				</SubTitle>
				<SubTitle marginSize={16}>
					I helped create an internal Teach Gia tool where in-market experts could work from seed questions based on
					real HR incidents and events. They could evaluate the question, identify the decision at hand and the
					information required to make it responsibly, review the relevant material, then either generate a response or
					ask for the additional context needed to proceed.
				</SubTitle>
				<SubTitle margin={false}>
					That feedback loop improved how Gia approached country-specific HR questions, including when the right next
					step was to ask for more information, acknowledge it did not have suitable information, or direct a user to
					useful resources rather than produce an overconfident answer.
				</SubTitle>
			</Section>
			<Section gradient={true}>
				<ProjectTitle>From research to action</ProjectTitle>
				<SubTitle marginSize={16}>
					A conversation was only the beginning of the workflow. The product needed to help users go from a question to
					understanding, verification, creation, collaboration, and action without losing the context that made the work
					trustworthy.
				</SubTitle>
				<SubTitle margin={false}>
					<strong>Ask - Understand - Verify - Create - Collaborate - Act.</strong> This progression became the
					organizing principle for both the product experience and the underlying system.
				</SubTitle>
			</Section>
			<Section gradient={true}>
				<ProjectTitle>Compliance monitoring turns change into a next step</ProjectTitle>
				<SubTitle marginSize={16}>
					For customers, the risk is not only answering a hard HR question incorrectly. It is missing an external change
					that could affect the policies, documents, and contracts they already use.
				</SubTitle>
				<SubTitle marginSize={16}>
					Gia&apos;s compliance monitor gives teams a more proactive workflow. After they add their own relevant HR
					content to the knowledge base, Gia can analyze regulatory updates, assess potential impact on existing policy,
					and point people to the documents and actions that need review.
				</SubTitle>
				<SubTitle marginSize={16}>
					<strong>See the change:</strong> A relevant regulatory update is surfaced instead of waiting for a user to
					know that a question needs asking.
				</SubTitle>
				<SubTitle marginSize={16}>
					<strong>Connect it to company context:</strong> Gia evaluates the update against the team&apos;s own HR
					policies, documents, and contracts in the knowledge base.
				</SubTitle>
				<SubTitle marginSize={16}>
					<strong>Understand the impact:</strong> The user can see why the change may matter and which current material
					warrants attention.
				</SubTitle>
				<SubTitle marginSize={32}>
					<strong>Move into action:</strong> The output becomes a concrete review or follow-up path, not a generic
					alert.
				</SubTitle>
				<HeroImage
					heroImage={themedImages.monitor}
					dropShadow={false}
					border={true}
					heroMargin={0}
					standAlone={true}
					heroAltText={
						'Gia compliance-monitor workflow from regulatory update through company-document impact assessment to a recommended policy review action.'
					}
				/>
			</Section>
			<Section gradient={true}>
				<ProjectTitle>Architecture in service of the workflow</ProjectTitle>
				<SubTitle marginSize={16}>
					I led implementation of the React frontend and Node.js BFF, pairing the interaction model with Redis,
					DynamoDB, WebSockets, and collaborative document editing. This is intentionally a conceptual view of the
					system, not a disclosure of proprietary internals.
				</SubTitle>
				<SubTitle marginSize={16}>
					The architecture supported a responsive workspace where source-aware answers, working documents, and team
					edits could stay coordinated as the user moved from exploration into action.
				</SubTitle>
				<HeroImage
					heroImage={themedImages.architecture}
					imgBackgroundColor={'transparent'}
					dropShadow={false}
					border={false}
					heroMargin={0}
					standAlone={true}
					heroAltText={
						'Conceptual Gia architecture from React workspace through a Node.js BFF to source services, Redis, DynamoDB, WebSockets, and collaborative documents.'
					}
				/>
				<HeroImage
					heroImage={themedImages.colabArch}
					imgBackgroundColor={'transparent'}
					dropShadow={false}
					border={false}
					heroMargin={0}
					standAlone={true}
					heroAltText={
						'Conceptual Gia architecture from React workspace through a Node.js BFF to source services, Redis, DynamoDB, WebSockets, and collaborative documents.'
					}
				/>
			</Section>
			<Section gradient={true}>
				<ProjectTitle>What I intentionally did not build</ProjectTitle>
				<SubTitle marginSize={16}>
					<strong>Not a generic chatbot:</strong> The goal was a professional environment for high-stakes, global HR
					work, not an open-ended answer box.
				</SubTitle>
				<SubTitle marginSize={16}>
					<strong>Not only reactive:</strong> Gia can monitor regulatory changes against a customer&apos;s own knowledge
					base and surface where HR policies or documents may need action.
				</SubTitle>
				<SubTitle marginSize={16}>
					<strong>Not fabricated certainty:</strong> When Gia lacks suitable information for a confident answer, it says
					so and directs users toward helpful resources rather than making up an answer.
				</SubTitle>
				<SubTitle marginSize={16}>
					<strong>Not a black box:</strong> Expert-authored and reviewed material, sources, citations, and review were
					part of the product because opacity is a poor foundation for compliance confidence.
				</SubTitle>
				<SubTitle marginSize={16}>
					<strong>Not a one-shot prompt workflow:</strong> In-market experts could iteratively teach and evaluate Gia
					with real HR scenarios, including when the correct response was to ask for more context.
				</SubTitle>
				<SubTitle marginSize={16}>
					<strong>Not a document generator in isolation:</strong> Artifacts remain connected to the research and human
					review that gives them context.
				</SubTitle>
				<SubTitle margin={false}>
					<strong>Not a substitute for professional judgment:</strong> Gia makes expertise easier to access, understand,
					and apply while keeping people accountable for the decisions they make.
				</SubTitle>
			</Section>
			<Section gradient={true}>
				<ProjectTitle>My role</ProjectTitle>
				<SubTitle marginSize={16}>
					I owned user research, concept design, early prototyping and testing, the design language, and the full UI/UX.
					I then led implementation of the React frontend and Node.js BFF, including the realtime and collaborative
					document-editing workflows that carried the experience from idea to shipped product.
				</SubTitle>
				<SubTitle margin={false}>
					The work centered on two linked ideas: make generative AI trustworthy enough for high-stakes HR work, then
					make it actionable enough to help teams move real work forward.
				</SubTitle>
			</Section>
		</Wrapper>
	);
}
